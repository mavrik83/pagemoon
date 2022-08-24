import { Post } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export const postApi = {
    getPosts: async () => {
        const posts = await apiRequest.get<null, Post[]>('/api/posts');
        return posts;
    },
    upsertPost: async (params: Partial<Post>) => {
        const newPost = await apiRequest.post<null, Post>('/api/posts', params);
        return newPost;
    },
};
