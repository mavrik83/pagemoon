import { Category } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export const categoryApi = {
    getCategories: async () => {
        const categories = await apiRequest.get<null, Category[]>(
            '/api/categories',
        );
        return categories;
    },
    createCategory: async (params: Partial<Category>) => {
        const newCategory = await apiRequest.post<null, Category>(
            '/api/categories',
            params,
        );
        return newCategory;
    },
};
