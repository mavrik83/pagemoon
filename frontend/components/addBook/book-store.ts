import create from 'zustand';
import { Category } from '@prisma/client';
import { categoryApi } from '../../utils/api';
import { ListOption } from '../reusable/singleMultiSelect';
import { IsbnBook } from '../../models/books';
import { title } from '../../utils/helpers';

interface BookStoreState {
    options: ListOption[];
    selectedCategories: ListOption[];
    categoryStatus: 'done' | 'loading' | 'error' | 'idle';
    isbnData: Partial<IsbnDbMappedData> | undefined;
}

interface BookStoreActions {
    setSelectedCategories: (selectedCategories: ListOption[]) => void;
    fetchCategories: () => void;
    resetBookState: () => void;
    setIsbnData: (isbnDataResponse: IsbnBook) => void;
}

interface IsbnDbMappedData {
    title: string;
    authors: string;
    isbn: string;
    publisher: string;
    datePublished: string;
    edition: string;
    language: string;
    pages: number;
    synopsis: string;
    binding: string;
    coverLink: string;
}

const initialBookState: BookStoreState = {
    options: [],
    selectedCategories: [],
    categoryStatus: 'idle',
    isbnData: undefined,
};

export const useBookStore = create<BookStoreState & BookStoreActions>()(
    (set, get) => ({
        // State
        ...initialBookState,
        // Actions
        resetBookState: () => {
            set(initialBookState);
        },
        setSelectedCategories: (selectedCategories) => {
            set({ selectedCategories });
        },
        fetchCategories: async () => {
            set({ categoryStatus: 'loading' });
            const { options: checkOptions } = get();
            if (checkOptions.length > 0) {
                set({ categoryStatus: 'done' });
                return;
            }
            try {
                categoryApi
                    .getCategories()
                    .then((res) => {
                        const options: ListOption[] = res.map(
                            (category: Category) => ({
                                id: category.id as string,
                                name: category.name as string,
                            }),
                        );
                        return options;
                    })
                    .then((options) => {
                        set({ options, categoryStatus: 'done' });
                    });
            } catch (error) {
                set({ categoryStatus: 'error' });
            }
        },
        setIsbnData: (isbnDataResponse) => {
            set({
                isbnData: {
                    title: title(isbnDataResponse.book.title),
                    authors:
                        isbnDataResponse.book.authors?.length! > 0
                            ? title(isbnDataResponse.book.authors!.join(' & '))
                            : title(
                                  isbnDataResponse.book.authors![0] as string,
                              ),
                    isbn:
                        isbnDataResponse.book.isbn ||
                        isbnDataResponse.book.isbn13,
                    coverLink: isbnDataResponse.book.image,
                    publisher: title(
                        isbnDataResponse.book.publisher?.toLowerCase(),
                    ),
                    datePublished: isbnDataResponse.book.date_published,
                    edition: isbnDataResponse.book.edition,
                    language: isbnDataResponse.book.language,
                    pages: isbnDataResponse.book.pages,
                    synopsis: isbnDataResponse.book.synopsis,
                    binding: isbnDataResponse.book.binding,
                },
            });
        },
    }),
);
