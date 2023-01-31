import { Review } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export interface SaveReviewParams
    extends Partial<Omit<Review, 'userId' | 'createdAt' | 'updatedAt'>> {
    tagIds?: string[];
    bookId?: string;
    userUid?: string;
}

export const reviewApi = {
    getReviews: async () => {
        const reviews = await apiRequest.get<null, Review[]>('/api/reviews');
        return reviews;
    },
    upsertReview: async (params: SaveReviewParams) => {
        const newReview = await apiRequest.post<SaveReviewParams, Review>(
            '/api/reviews',
            params,
        );
        return newReview;
    },
    getReviewById: async (id: string) => {
        const review = await apiRequest.get<string, Review>(
            `/api/reviews?id=${id}`,
        );
        return review;
    },
};
