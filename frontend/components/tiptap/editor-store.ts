import { Category } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { toast } from 'react-hot-toast';
import create from 'zustand';
import { SavePostParams } from '../../utils/api/Posts';
import { categoryApi, postApi } from '../../utils/api';
import { FUser } from '../../utils/contexts/firebaseProvider';
import { debounce } from '../../utils/helpers/debounce';

interface IOption {
    id: string;
    name: string;
}

interface PostData {
    id: string;
    categoryIds: string[];
}

interface IEditorState {
    postData: PostData;
    rawContent: JSONContent;
    draftMode: boolean;
    touched: boolean;
    categoryStatus: 'done' | 'loading' | 'error' | 'idle';
    options: IOption[];
    selectedCategories: IOption[];
    isLoadingCategories: boolean;
    charCount: number;
}

interface IEditorActions {
    fetchCategories: () => void;
    createCategory: (name: string, authUser: FUser) => void;
    setPostData: (postData: PostData) => void;
    setRawContent: (rawContent: JSONContent) => void;
    setDraftMode: (draftMode: boolean) => void;
    setTouched: (touched: boolean) => void;
    setOptions: (categoryData?: Category[]) => void;
    setSelectedCategories: (selectedCategories: IOption[]) => void;
    setIsLoadingCategories: (isLoadingCategories: boolean) => void;
    getTitle: () => string;
    getDescription: () => string;
    savePost: (authUser: FUser, draftModeParam?: boolean) => void;
    triggerDelayedSave: (authUser: FUser) => void;
    setCharCount: (charCount: number) => void;
    determineReadTime: () => number;
}
export const useEditorStore = create<IEditorState & IEditorActions>()(
    (set, get) => ({
        // State
        postData: {
            id: '',
            categoryIds: [],
        },
        rawContent: {},
        draftMode: true,
        touched: false,
        categoryStatus: 'idle',
        options: [],
        selectedCategories: [],
        isLoadingCategories: false,
        charCount: 0,
        // Actions
        fetchCategories: async () => {
            set({ categoryStatus: 'loading' });
            set({ isLoadingCategories: true });
            categoryApi
                .getCategories()
                .then((res) => {
                    useEditorStore.getState().setOptions(res);
                    set({ categoryStatus: 'done' });
                })
                .then(() => {
                    set({ isLoadingCategories: false });
                })
                .catch(() => {
                    set({ categoryStatus: 'error' });
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
        setPostData: (postData) => {
            set({ postData });
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
        setOptions: (categoryData) => {
            const { postData } = get();

            const options =
                categoryData &&
                categoryData.map((category) => ({
                    name: category.name as string,
                    id: category.id,
                }));
            set({ options });

            if (postData && postData.categoryIds.length > 0 && options) {
                // if there are categories in the post, set the selected categories
                const selectedCategories = options.filter((option) =>
                    postData.categoryIds.includes(option.id),
                );
                set({ selectedCategories });
            }
        },
        setSelectedCategories: (selectedCategories) => {
            set({ selectedCategories });
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
                    selectedCategories,
                    rawContent,
                    postData,
                    draftMode,
                    getTitle,
                    getDescription,
                    setTouched,
                    setPostData,
                    setDraftMode,
                    determineReadTime,
                } = get();

                // find any new categories that were added
                const newCategories = selectedCategories.map(({ id }) => id);

                const newPost: SavePostParams = {
                    title: getTitle(),
                    description: getDescription(),
                    rawContent,
                    draftMode: draftModeParam || draftMode,
                    categoryIds: newCategories,
                    userUid: authUser.uid,
                    readTime: determineReadTime(),
                };

                const updatePost: SavePostParams = {
                    ...newPost,
                    id: postData.id,
                };

                const savedPost = await postApi.upsertPost(
                    postData.id.length > 0 ? updatePost : newPost,
                );

                setPostData({
                    id: savedPost.id,
                    categoryIds: savedPost.categoryIds,
                });
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
        setCharCount: (charCount) => {
            set({ charCount });
        },
        determineReadTime: () => {
            const { charCount } = get();
            return Math.ceil(charCount / 200);
        },
    }),
);
