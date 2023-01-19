import create from 'zustand';
import { Category } from '@prisma/client';
import { categoryApi } from '../../utils/api';
import { ListOption } from '../reusable/singleMultiSelect';

interface BookStoreState {
    options: ListOption[];
    selectedCategories: ListOption[];
    categoryStatus: 'done' | 'loading' | 'error' | 'idle';
}

interface BookStoreActions {
    setSelectedCategories: (selectedCategories: ListOption[]) => void;
    fetchCategories: () => void;
}

export const useBookStore = create<BookStoreState & BookStoreActions>()(
    (set, get) => ({
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
    }),
);
