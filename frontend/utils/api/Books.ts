import { Book } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export interface SaveBookParams extends Partial<Book> {
    categoryIds?: string[];
}

export const bookApi = {
    getBooks: async () => {
        const books = await apiRequest.get<null, Book[]>('/api/books');
        return books;
    },
    createBook: async (params: SaveBookParams) => {
        const newBook = await apiRequest.post<SaveBookParams, Book>(
            '/api/books',
            params,
        );
        return newBook;
    },
};
