import { Article } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export interface SaveArticleParams
    extends Partial<Omit<Article, 'userId' | 'createdAt' | 'updatedAt'>> {
    tagIds?: string[];
    bookIds?: string[];
    themeIds?: string[];
    userUid?: string;
}

export const articleApi = {
    getArticles: async () => {
        const articles = await apiRequest.get<null, Article[]>('/api/articles');
        return articles;
    },
    upsertArticle: async (params: SaveArticleParams) => {
        const newArticle = await apiRequest.post<SaveArticleParams, Article>(
            '/api/articles',
            params,
        );
        return newArticle;
    },
    getArticleById: async (id: string) => {
        const article = await apiRequest.get<string, Article>(
            `/api/articles?id=${id}`,
        );
        return article;
    },
};
