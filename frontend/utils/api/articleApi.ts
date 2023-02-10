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
    createArticle: async (params: SaveArticleParams) => { 
        const newArticle = await apiRequest.post<
            SaveArticleParams,
            Article & {
                bookIds: string[];
                tagIds: string[];
                themeIds?: string[];
            }
        >('/api/articles/create', params);
        return newArticle;
    },
    updateArticle: async (params: SaveArticleParams) => {
        const newArticle = await apiRequest.post<
            SaveArticleParams,
            Article & {
                bookIds: string[];
                tagIds: string[];
                themeIds?: string[];
            }
        >('/api/articles', params);
        return newArticle;
    },
    getArticleById: async (id: string) => {
        const article = await apiRequest.get<
            string,
            Article & {
                bookIds: string[];
                tagIds: string[];
                themeIds?: string[];
            }
        >(`/api/articles?id=${id}`);
        return article;
    },
};
