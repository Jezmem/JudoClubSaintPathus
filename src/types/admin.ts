export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  lastLogin?: string;
  active: boolean;
}

export interface AdminStats {
  totalNews: number;
  totalPhotos: number;
  totalMessages: number;
  totalRegistrations: number;
  pendingMessages: number;
  pendingRegistrations: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: 'news' | 'photo' | 'message' | 'registration';
  action: 'created' | 'updated' | 'deleted';
  title: string;
  date: string;
  user: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}