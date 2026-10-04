import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DashboardApiService } from '../api/dashboard-api.service';
import { AuthService } from '../auth/auth.service';
import {
  DashboardChartPoint,
  DashboardCharts,
  DashboardDto,
} from '../models/api.models';

type ChartKey = keyof DashboardCharts;
interface DashboardChartView {
  key: ChartKey;
  title: string;
  description: string;
  points: DashboardChartPoint[];
  demo: boolean;
}

@Component({
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  styleUrl: './dashboard-page.component.scss',
  templateUrl: './dashboard-page.component.html',
  })
export class DashboardPageComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly api = inject(DashboardApiService);
  private readonly route = inject(ActivatedRoute);
  dashboard: DashboardDto | null = null;
  error = '';
  private readonly demoCharts: Record<ChartKey, DashboardChartPoint[]> = {
    productsByCategory: [
      { label: 'Electronics', value: 8 },
      { label: 'Home', value: 12 },
      { label: 'Accessories', value: 6 },
      { label: 'Lifestyle', value: 9 },
    ],
    productsByType: [
      { label: 'Premium', value: 5 },
      { label: 'Standard', value: 15 },
    ],
    stockByLevel: [
      { label: 'Low (0–4)', value: 3 },
      { label: 'Medium (5–19)', value: 10 },
      { label: 'High (20+)', value: 7 },
    ],
    usersByStatus: [
      { label: 'Enabled', value: 9 },
      { label: 'Disabled', value: 1 },
    ],
  };
  get greeting(): string {
    const hour = new Date().getHours();
    return hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';
  }
  get metricEntries(): [string, number][] {
    return Object.entries(this.dashboard?.metrics ?? {});
  }
  get visibleCharts(): DashboardChartView[] {
    if (!this.dashboard) return [];
    const chartKeys: Record<DashboardDto['dashboard'], ChartKey[]> = {
      admin: ['productsByCategory', 'productsByType', 'stockByLevel', 'usersByStatus'],
      moderator: ['productsByCategory', 'stockByLevel'],
      premium: ['productsByCategory', 'productsByType'],
      user: ['productsByCategory'],
    };
    const keys = chartKeys[this.dashboard.dashboard];
    const meta: Record<ChartKey, { title: string; description: string }> = {
      productsByCategory: { title: 'Products by category', description: 'Active catalog mix' },
      productsByType: { title: 'Premium & standard', description: 'Active product types' },
      stockByLevel: { title: 'Stock levels', description: 'Inventory distribution' },
      usersByStatus: { title: 'Account status', description: 'Enabled and disabled users' },
    };
    return keys.map((key) => {
      const apiPoints = this.dashboard?.charts?.[key];
      return {
        key,
        ...meta[key],
        points: apiPoints?.length ? apiPoints : this.demoCharts[key],
        demo: !apiPoints?.length,
      };
    });
  }
  chartBarWidth(value: number, points: DashboardChartPoint[]): number {
    const max = Math.max(...points.map((point) => point.value), 1);
    return value > 0 ? Math.max(8, (value / max) * 100) : 0;
  }
  get roleTitle(): string {
    return (
      {
        admin: 'ADMIN CONTROL CENTER',
        moderator: 'MODERATOR WORKSPACE',
        premium: 'PREMIUM MEMBERSHIP',
        user: 'YOUR PERSONAL SPACE',
      } as const
    )[this.dashboard?.dashboard ?? 'user'];
  }
  get roleDescription(): string {
    return (
      {
        admin: 'A clear view of your people, products, and platform activity.',
        moderator:
          'Keep the catalog healthy and the product experience running smoothly.',
        premium: 'Your member view, with a little more of what you love.',
        user: 'Your account and a handpicked look at what is happening in the shop.',
      } as const
    )[this.dashboard?.dashboard ?? 'user'];
  }
  get roleMark(): string {
    return ({ admin: 'A', moderator: 'M', premium: '✦', user: 'N' } as const)[
      this.dashboard?.dashboard ?? 'user'
    ];
  }
  get statsTitle(): string {
    return this.dashboard?.dashboard === 'admin'
      ? 'Platform snapshot'
      : this.dashboard?.dashboard === 'moderator'
        ? 'Catalog health'
        : this.dashboard?.dashboard === 'premium'
          ? 'Your member benefits'
          : 'Your shop snapshot';
  }
  ngOnInit(): void {
    const requested = this.route.snapshot.data['dashboard'] as
      | DashboardDto['dashboard']
      | undefined;
    const roles = this.auth.currentUser?.roles ?? [];
    const kind =
      requested ??
      (roles.includes('ROLE_ADMIN')
        ? 'admin'
        : roles.includes('ROLE_MODERATOR')
          ? 'moderator'
          : roles.includes('ROLE_PREMIUM_USER')
            ? 'premium'
            : 'user');
    (requested ? this.api.get(kind) : this.api.getOverview())
      .subscribe({
        next: (data) => (this.dashboard = data),
        error: (err) =>
          (this.error =
            err.status === 403
              ? 'Your account does not have access to this dashboard.'
              : err.status === 401
                ? 'Your session has expired. Please sign in again.'
                : 'Unable to load the dashboard. Please try again.'),
      });
  }
  metricLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (value) => value.toUpperCase());
  }
  metricMark(index: number): string {
    return ['↗', '◉', '◌', '◇'][index % 4];
  }
  metricHint(key: string): string {
    return key.toLowerCase().includes('lowstock')
      ? 'Needs a closer look'
      : key.toLowerCase().includes('inactive')
        ? 'Currently unavailable'
        : key.toLowerCase().includes('premium')
          ? 'Members collection'
          : 'Updated from your account';
  }
}

