import { Post } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export interface SavePostParams
    extends Partial<Omit<Post, 'userId' | 'createdAt' | 'updatedAt'>> {
    categoryIds?: string[];
    userUid?: string;
}

export const postApi = {
    getPosts: async () => {
        const posts = await apiRequest.get<null, Post[]>('/api/posts');
        return posts;
    },
    upsertPost: async (params: SavePostParams) => {
        const newPost = await apiRequest.post<null, Post>('/api/posts', params);
        return newPost;
    },
};
