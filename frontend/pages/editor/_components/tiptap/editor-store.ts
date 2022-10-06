import { Category } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { toast } from 'react-hot-toast';
import { OnChangeValue } from 'react-select';
import create from 'zustand';
import { SavePostParams } from '../../../../utils/api/Posts';
import { categoryApi, postApi } from '../../../../utils/api';
import { FUser } from '../../../../utils/contexts/firebaseProvider';
import { debounce } from '../../../../utils/helpers/debounce';

interface IOption {
    value: string;
    label: string;
}

interface IEditorState {
    postId: string;
    rawContent: JSONContent;
    draftMode: boolean;
    touched: boolean;
    categoryIds: string[];
    pendingCategoryIds: string[];
    categoryData: Category[] | 'loading' | 'error' | 'idle';
    options: IOption[];
    selectedCategories: IOption[];
    categoryDisplayOptions: IOption[];
    isLoadingCategories: boolean;
}

interface IEditorActions {
    fetchCategories: () => void;
    createCategory: (name: string, authUser: FUser) => void;
    setPostId: (postId: string) => void;
    setRawContent: (rawContent: JSONContent) => void;
    setDraftMode: (draftMode: boolean) => void;
    setTouched: (touched: boolean) => void;
    setCategoryIds: (categoryIds: string[]) => void;
    setPendingCategoryIds: (selectedCategories: IOption[]) => void;
    setOptions: (categoryData: Category[]) => void;
    setSelectedCategories: (
        selectedCategories: OnChangeValue<IOption, true>,
    ) => void;
    setCategoryDisplayOptions: (categoryDisplayOptions: IOption[]) => void;
    setIsLoadingCategories: (isLoadingCategories: boolean) => void;
    getTitle: () => string;
    getDescription: () => string;
    savePost: (authUser: FUser, draftModeParam?: boolean) => void;
    triggerDelayedSave: (authUser: FUser) => void;
}
export const useEditorStore = create<IEditorState & IEditorActions>()(
    (set, get) => ({
        // State
        postId: '',
        rawContent: {},
        draftMode: true,
        touched: false,
        categoryIds: [],
        pendingCategoryIds: [],
        categoryData: 'idle',
        options: [],
        selectedCategories: [],
        categoryDisplayOptions: [],
        isLoadingCategories: false,
        // Actions
        fetchCategories: async () => {
            set({ categoryData: 'loading' });
            set({ isLoadingCategories: true });
            categoryApi
                .getCategories()
                .then((res) => {
                    set({ categoryData: res });
                    useEditorStore.getState().setOptions(res);
                })
                .then(() => {
                    set({ isLoadingCategories: false });
                })
                .catch(() => {
                    set({ categoryData: 'error' });
                    toast.error('Error fetching categories');
                });
        },
        createCategory: async (name, authUser) => {
            const { fetchCategories } = get();

            if (!authUser) {
                toast.error('You must be logged in to create categories');
                return;
            }

            categoryApi
                .createCategory({ name, userUid: authUser.uid })
                .then(() => {
                    toast.success('Category created');
                    fetchCategories();
                })
                .catch(() => {
                    toast.error('Error creating category');
                });
        },
        setPostId: (postId) => {
            set({ postId });
        },
        setRawContent: (rawContent) => {
            set({ rawContent });
        },
        setDraftMode: (draftMode) => {
            set({ draftMode });
        },
        setTouched: (touched) => {
            set({ touched });
        },
        setCategoryIds: (categoryIds) => {
            set({ categoryIds });
        },
        setPendingCategoryIds: (selectedCategories) => {
            const pendingCategoryIds = selectedCategories.map(
                (category) => category.value,
            );
            set({ pendingCategoryIds });
        },
        setOptions: (categoryData) => {
            const options = categoryData.map((category) => ({
                value: category.id,
                label: category.name || '',
            }));
            set({ options });
        },
        setSelectedCategories: (selectedCategories) => {
            const { setPendingCategoryIds } = get();
            set({ selectedCategories: selectedCategories as IOption[] });
            setPendingCategoryIds(selectedCategories as IOption[]);
        },
        setCategoryDisplayOptions: (categoryDisplayOptions) => {
            set({ categoryDisplayOptions });
        },
        setIsLoadingCategories: (isLoadingCategories) => {
            set({ isLoadingCategories });
        },
        getTitle: () => {
            const { rawContent } = get();
            const documentContent = rawContent.content;
            const preview = documentContent?.find(
                (item) => item.type === 'heading',
            );
            // deeply iterate through previewTitle to get the value of all text properties and join them in string
            const previewTitle =
                preview &&
                preview.content &&
                preview.content.reduce((acc, curr) => {
                    if (curr.type === 'text') {
                        return acc + curr.text;
                    }

                    return acc;
                }, '');
            return previewTitle || 'No title';
        },
        getDescription: () => {
            const { rawContent } = get();
            const documentContent = rawContent.content;
            const preview = documentContent?.find(
                (item) => item.type === 'paragraph',
            );
            // deeply iterate through previewTitle to get the value of all text properties and join them in string
            const previewDescription =
                preview &&
                preview.content &&
                preview.content.reduce((acc, curr) => {
                    if (curr.type === 'text') {
                        return acc + curr.text;
                    }

                    return acc;
                }, '');
            return previewDescription || 'No description';
        },
        savePost: async (authUser, draftModeParam?) => {
            try {
                if (!authUser) {
                    toast.error('You must be logged in to save a post');
                    return;
                }

                const {
                    pendingCategoryIds,
                    rawContent,
                    categoryIds,
                    postId,
                    draftMode,
                    getTitle,
                    getDescription,
                    setTouched,
                    setPostId,
                    setDraftMode,
                } = get();

                // find any new categories that were added
                const newCategories = pendingCategoryIds.filter(
                    (id) => !categoryIds.includes(id),
                );

                const newPost: SavePostParams = {
                    title: getTitle(),
                    description: getDescription(),
                    rawContent,
                    draftMode: draftModeParam || draftMode,
                    categoryIds: newCategories,
                    userUid: authUser.uid,
                };

                const updatePost: SavePostParams = {
                    ...newPost,
                    id: postId,
                };

                const savedPost = await postApi.upsertPost(
                    postId.length > 0 ? updatePost : newPost,
                );

                setPostId(savedPost.id);
                setTouched(false);
                setDraftMode(draftModeParam || draftMode);

                toast.success('Saved...');
            } catch (err: any) {
                toast.error(`Error: ${err.message}`);
            }
        },
        triggerDelayedSave: debounce({ delay: 5000 }, (authUser) => {
            const { savePost } = get();
            savePost(authUser);
        }),
    }),
);
