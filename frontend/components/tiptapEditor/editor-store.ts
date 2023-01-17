import { Category } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { toast } from 'react-hot-toast';
import create from 'zustand';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { generateHTML } from '@tiptap/html';
import { SavePostParams } from '../../utils/api/Posts';
import { categoryApi, postApi } from '../../utils/api';
import { FUser } from '../../utils/contexts/firebaseProvider';
import { debounce } from '../../utils/helpers/debounce';

export interface IOption {
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
    htmlContent: string;
    status: 'published' | 'draft';
    touched: boolean;
    categoryStatus: 'done' | 'loading' | 'error' | 'idle';
    options: IOption[];
    selectedCategories: IOption[];
    charCount: number;
}

interface IEditorActions {
    fetchCategories: () => void;
    createCategory: (name: string, authUser: FUser) => void;
    setPostData: (postData: PostData) => void;
    setRawContent: (rawContent: JSONContent) => void;
    setHtmlContent: (htmlContent: string) => void;
    setStatus: (status: IEditorState['status']) => void;
    setTouched: (touched: boolean) => void;
    setOptions: (categoryData?: Category[]) => void;
    setSelectedCategories: (selectedCategories: IOption[]) => void;
    getTitle: () => string;
    getDescription: () => string;
    savePost: (authUser: FUser, status?: IEditorState['status']) => void;
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
        htmlContent: '',
        status: 'draft',
        touched: false,
        categoryStatus: 'idle',
        options: [],
        selectedCategories: [],
        charCount: 0,
        // Actions
        fetchCategories: async () => {
            set({ categoryStatus: 'loading' });
            categoryApi
                .getCategories()
                .then((res) => {
                    useEditorStore.getState().setOptions(res);
                    set({ categoryStatus: 'done' });
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
        setHtmlContent: (htmlContent) => {
            set({ htmlContent });
        },
        setStatus: (status) => {
            set({ status });
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
        savePost: async (authUser, statusParam) => {
            try {
                if (!authUser) {
                    toast.error('You must be logged in to save a post');
                    return;
                }

                const {
                    selectedCategories,
                    rawContent,
                    postData,
                    status,
                    getTitle,
                    getDescription,
                    setTouched,
                    setPostData,
                    setStatus,
                    setHtmlContent,
                    determineReadTime,
                } = get();

                const htmlContentGen = generateHTML(rawContent, [
                    StarterKit,
                    Document,
                    Underline,
                    Placeholder,
                    TextAlign,
                    Typography,
                ]);

                // find any new categories that were added
                const newCategories = selectedCategories.map(({ id }) => id);

                const newPost: SavePostParams = {
                    title: getTitle(),
                    description: getDescription(),
                    rawContent,
                    htmlContent: htmlContentGen,
                    status: statusParam || status,
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
                setStatus(statusParam || status);
                setHtmlContent(savedPost.htmlContent || '');

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
