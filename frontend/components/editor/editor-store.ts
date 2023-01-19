import { Book, Category } from '@prisma/client';
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
import { bookApi, categoryApi, postApi } from '../../utils/api';
import { FUser } from '../../utils/contexts/firebaseProvider';
import { debounce } from '../../utils/helpers/debounce';
import { ListOption } from '../reusable/singleMultiSelect';

interface PostData {
    id: string;
    categoryIds: string[];
    bookId: string;
}

interface IEditorState {
    postData: PostData;
    rawContent: JSONContent;
    htmlContent: string;
    status: 'published' | 'draft';
    touched: boolean;
    categoryStatus: 'done' | 'loading' | 'error' | 'idle';
    options: ListOption[];
    selectedCategories: ListOption[];
    charCount: number;
    bookStatus: 'done' | 'loading' | 'error' | 'idle';
    bookOptions: ListOption[];
    selectedBook: ListOption;
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
    setSelectedCategories: (selectedCategories: ListOption[]) => void;
    getTitle: () => string;
    getDescription: () => string;
    savePost: (authUser: FUser, status?: IEditorState['status']) => void;
    triggerDelayedSave: (authUser: FUser) => void;
    setCharCount: (charCount: number) => void;
    determineReadTime: () => number;
    setBookOptions: (bookData?: Book[]) => void;
    setSelectedBook: (selectedBook: ListOption) => void;
    fetchBooks: () => void;
    resetEditorState: () => void;
}

const initialEditorState: IEditorState = {
    postData: {
        id: '',
        categoryIds: [],
        bookId: '',
    },
    bookOptions: [],
    selectedBook: {
        id: '',
        name: '',
    },
    bookStatus: 'idle',
    rawContent: {},
    htmlContent: '',
    status: 'draft',
    touched: false,
    categoryStatus: 'idle',
    options: [],
    selectedCategories: [],
    charCount: 0,
};

export const useEditorStore = create<IEditorState & IEditorActions>()(
    (set, get) => ({
        // State
        ...initialEditorState,
        // Actions
        resetEditorState: () => {
            set(initialEditorState);
        },
        fetchBooks: async () => {
            set({ bookStatus: 'loading' });
            bookApi
                .getBooks()
                .then((res) => {
                    useEditorStore.getState().setBookOptions(res);
                    set({ bookStatus: 'done' });
                })
                .catch(() => {
                    set({ bookStatus: 'error' });
                    toast.error('Error fetching books');
                });
        },
        setBookOptions: (bookData) => {
            const { postData } = get();

            const options =
                bookData &&
                bookData.map((book) => ({
                    name: book.title as string,
                    id: book.id,
                }));
            set({ bookOptions: options });

            if (postData && postData.bookId && options) {
                // if there is a book in the post, set the selected book
                const selectedBook = options.find(
                    (option) => option.id === postData.bookId,
                );
                set({ selectedBook });
            }
        },
        setSelectedBook: (selectedBook) => {
            set({ selectedBook });
        },
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
                    selectedBook,
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
                    bookId: selectedBook?.id,
                    userUid: authUser.uid,
                    readTime: determineReadTime(),
                };

                const updatePost: SavePostParams = {
                    ...newPost,
                    id: postData.id,
                };

                if (!newPost.bookId) {
                    toast.error('You must select a book');
                    return;
                }

                const savedPost = await postApi.upsertPost(
                    postData.id.length > 0 ? updatePost : newPost,
                );

                setPostData({
                    id: savedPost.id,
                    categoryIds: savedPost.categoryIds,
                    bookId: savedPost.bookId as string,
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
            const { rawContent } = get();
            // get the text from the document
            const text = rawContent
                .content!.map((item) => {
                    if (item.type === 'paragraph') {
                        return item
                            .content!.map((para) => {
                                if (para.type === 'text') {
                                    return para.text;
                                }
                                return '';
                            })
                            .join('');
                    }
                    return '';
                })
                .join('');
            // get a word count
            const wordCount = text.split(' ').length;

            return Math.ceil(wordCount / 200);
        },
    }),
);
