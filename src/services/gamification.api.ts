import apiService from '@/services/api';
import type { PaginatedData } from '@/types';
import type {
  GamificationEntity,
  GamificationFeatureKey,
  GamificationListParams,
  GamificationUpsertPayload,
} from '@/types/gamification.types';

/**
 * Returns a typed CRUD client bound to a single gamification feature.
 * Mirrors the backend routes mounted under /api/gamification/<key>.
 */
export const gamificationApi = (key: GamificationFeatureKey) => {
  const BASE = `/gamification/${key}`;

  return {
    paginate: (params: GamificationListParams) =>
      apiService.get<PaginatedData<GamificationEntity>>(`${BASE}/paginate`, params),

    get: (id: string) => apiService.get<GamificationEntity>(`${BASE}/${id}`),

    create: (payload: GamificationUpsertPayload) =>
      apiService.post<GamificationEntity>(`${BASE}/add`, payload),

    update: (id: string, payload: GamificationUpsertPayload) =>
      apiService.post<GamificationEntity>(`${BASE}/update-by/${id}`, payload),

    archive: (id: string, archived: boolean) =>
      apiService.post<GamificationEntity>(`${BASE}/archive-by/${id}`, { archived }),

    remove: (id: string) => apiService.delete(`${BASE}/${id}`),
  };
};

export type GamificationApi = ReturnType<typeof gamificationApi>;
