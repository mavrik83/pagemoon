import create from 'zustand';
import { Theme } from '@prisma/client';
import toast from 'react-hot-toast';
import { themeApi } from '../../utils/api';
import { ListOption } from '../reusable/singleMultiSelect';
import { IsbnBook } from '../../models/books';
import { title } from '../../utils/helpers';
import { FUser } from '../../utils/contexts/firebaseProvider';

interface BookStoreState {
    options: ListOption[];
    selectedThemes: ListOption[];
    themeStatus: 'done' | 'loading' | 'error' | 'idle';
    isbnData: Partial<IsbnDbMappedData> | undefined;
}

interface BookStoreActions {
    setSelectedThemes: (selectedTags: ListOption[]) => void;
    fetchThemes: () => void;
    resetBookState: () => void;
    setIsbnData: (isbnDataResponse: IsbnBook) => void;
    createTheme: (name: string, authUser: FUser) => void;
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
    selectedThemes: [],
    themeStatus: 'idle',
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
        setSelectedThemes: (selectedThemes) => {
            set({ selectedThemes });
        },
        fetchThemes: async () => {
            set({ themeStatus: 'loading' });
            try {
                themeApi
                    .getThemes()
                    .then((res) => {
                        const options: ListOption[] = res.map((tag: Theme) => ({
                            id: tag.id as string,
                            name: tag.name as string,
                        }));
                        return options;
                    })
                    .then((options) => {
                        set({ options, themeStatus: 'done' });
                    });
            } catch (error) {
                set({ themeStatus: 'error' });
            }
        },
        createTheme: async (name, authUser) => {
            const { fetchThemes } = get();

            themeApi
                .createTheme({ name, userUid: authUser?.uid })
                .then(() => {
                    toast.success('Theme created');
                    fetchThemes();
                })
                .catch(() => {
                    toast.error('Error creating theme');
                });
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
