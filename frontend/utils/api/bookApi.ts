import { Book } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';
import { IsbnBook } from '../../models/books';

export interface SaveBookParams extends Partial<Book> {
    themeIds?: string[];
    coverImage?: string;
    userUid?: string;
}

export interface BookCover {
    id: Book['id'];
    coverImage: Book['coverImage'];
}

export const bookApi = {
    getBooks: async () => {
        const books = await apiRequest.get<null, Book[]>('/api/books');
        return books;
    },
    getSingleBook: async (id: string) => {
        const book = await apiRequest.get<null, Book>(`/api/books/${id}`);
        return book;
    },
    createBook: async (params: SaveBookParams) => {
        const newBook = await apiRequest.post<SaveBookParams, Book>(
            '/api/books/create',
            params,
        );
        return newBook;
    },
    getBookCovers: async () => {
        const book = await apiRequest.get<null, BookCover[]>(
            `/api/books/get-covers`,
        );
        return book;
    },
    searchIsbnDb: async (query: string) => {
        const book = await apiRequest.get<string, IsbnBook>(
            `/api/books/search-isbndb?q=${query}`,
        );
        return book;
    },
};
