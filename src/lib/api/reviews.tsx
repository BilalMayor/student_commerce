import { api } from './client'
import { Review } from '@/types'

export const reviewsApi = {
  getByProduct: (productId: string) =>
    api.get<Review[]>(`/reviews/product/${productId}`),

  getMyReviews: () =>
    api.get<Review[]>('/reviews/me'),

  create: (payload: { productId: string; rating: number; comment: string }) =>
    api.post<Review>('/reviews', payload),
}
