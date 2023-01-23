import { Post } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export interface SavePostParams
    extends Partial<Omit<Post, 'userId' | 'createdAt' | 'updatedAt'>> {
    tagIds?: string[];
    bookId?: string;
    userUid?: string;
}

export const postApi = {
    getPosts: async () => {
        const posts = await apiRequest.get<null, Post[]>('/api/posts');
        return posts;
    },
    upsertPost: async (params: SavePostParams) => {
        const newPost = await apiRequest.post<SavePostParams, Post>(
            '/api/posts',
            params,
        );
        return newPost;
    },
    getPostById: async (id: string) => {
        const post = await apiRequest.get<string, Post>(`/api/posts?id=${id}`);
        return post;
    },
};
