import { User } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export const userApi = {
    getUsers: async () => {
        const users = await apiRequest.get<null, User[]>('/api/users');
        return users;
    },
    createUser: async (params: Partial<User>) => {
        const newUser = await apiRequest.post<null, User>('/api/users', params);
        return newUser;
    },
};
