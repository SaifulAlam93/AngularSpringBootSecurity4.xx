export type Role =
  | 'ROLE_USER'
  | 'ROLE_MODERATOR'
  | 'ROLE_ADMIN'
  | 'ROLE_EMPLOYEE'
  | 'ROLE_PREMIUM_USER';

export interface LoginRequest {
  username: string;
  password: string;
}
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
export interface UserDto {
  userName: string;
  userFirstName: string | null;
  userLastName: string | null;
  email: string;
  enabled: boolean;
  roles: Role[];
  dateCreated?: string | null;
}
export interface LoginResponse {
  jwtToken: string;
  user: UserDto;
}
export interface ProductDto {
  id?: number;
  name: string;
  category: string;
  price: number;
  description?: string | null;
  stock: number;
  active?: boolean;
  premium?: boolean;
  imageUrl?: string | null;
  createdAt?: string;
}
export interface DashboardDto {
  dashboard: 'user' | 'moderator' | 'admin' | 'premium';
  username: string;
  roles: Role[];
  metrics: Record<string, number>;
  products: ProductDto[];
  charts?: DashboardCharts;
}
export interface DashboardChartPoint {
  label: string;
  value: number;
}
export interface DashboardCharts {
  productsByCategory?: DashboardChartPoint[];
  productsByType?: DashboardChartPoint[];
  stockByLevel?: DashboardChartPoint[];
  usersByStatus?: DashboardChartPoint[];
}
export interface AdminStatisticsDto {
  [key: string]: number;
}
