import create from 'zustand';
import { Category } from '@prisma/client';
import { categoryApi } from '../../utils/api';

export interface IOption {
    id: string;
    name: string;
}

interface BookStoreState {
    options: IOption[];
    selectedCategories: IOption[];
    categoryStatus: 'done' | 'loading' | 'error' | 'idle';
}

interface BookStoreActions {
    setSelectedCategories: (selectedCategories: IOption[]) => void;
    fetchCategories: () => void;
}

export const useBookStore = create<BookStoreState & BookStoreActions>()(
    (set) => ({
        // State
        options: [],
        selectedCategories: [],
        categoryStatus: 'idle',
        // Actions
        setSelectedCategories: (selectedCategories) => {
            set({ selectedCategories });
        },
        fetchCategories: async () => {
            set({ categoryStatus: 'loading' });
            try {
                categoryApi
                    .getCategories()
                    .then((res) => {
                        const options: IOption[] = res.map(
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
    }),
);
