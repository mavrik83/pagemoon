import { Book } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export const bookApi = {
    getBooks: async () => {
        const books = await apiRequest.get<null, Book[]>('/api/books');
        return books;
    },
    createBook: async (params: Partial<Book>) => {
        const newBook = await apiRequest.post<null, Book>('/api/books', params);
        return newBook;
    },
};
