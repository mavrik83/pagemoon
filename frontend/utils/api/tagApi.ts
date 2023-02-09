import { Tag } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export interface SaveTagParams extends Partial<Tag> {
    userUid?: string;
}

export const tagApi = {
    getTags: async () => {
        const tags = await apiRequest.get<null, Tag[]>('/api/tags');
        return tags;
    },
    createTag: async (params: SaveTagParams) => {
        const newTag = await apiRequest.post<SaveTagParams, Tag>(
            '/api/tags/create',
            params,
        );
        return newTag;
    },
};
