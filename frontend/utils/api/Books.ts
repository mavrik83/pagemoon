import { Book } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';
import { IsbnBook } from '../../models/books';

export interface SaveBookParams extends Partial<Book> {
    categoryIds?: string[];
    coverImage?: string;
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
    createBook: async (params: SaveBookParams) => {
        const newBook = await apiRequest.post<SaveBookParams, Book>(
            '/api/books',
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
        const book = await apiRequest.get<null, IsbnBook>(
            `/api/books/search-isbndb?q=${query}`,
        );
        return book;
    },
};
