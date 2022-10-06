import { Category } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export interface SaveCategoryParams extends Partial<Category> {
    userUid: string;
}

export const categoryApi = {
    getCategories: async () => {
        const categories = await apiRequest.get<null, Category[]>(
            '/api/categories',
        );
        return categories;
    },
    createCategory: async (params: SaveCategoryParams) => {
        const newCategory = await apiRequest.post<null, Category>(
            '/api/categories',
            params,
        );
        return newCategory;
    },
};
