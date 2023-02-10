import { Book, Tag, Theme } from '@prisma/client';
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
import { SaveReviewParams } from '../../utils/api/reviewApi';
import { bookApi, tagApi, reviewApi, themeApi } from '../../utils/api';
import { FUser } from '../../utils/contexts/firebaseProvider';
import { debounce } from '../../utils/helpers/debounce';
import { ListOption } from '../reusable/singleMultiSelect';
import { capitalize } from '../../utils/helpers';
import { articleApi, SaveArticleParams } from '../../utils/api/articleApi';

interface ContentData {
    id: string;
    tagIds: string[];
    bookIds: string | string[];
    themeIds?: string[];
}

interface IEditorState {
    contentType: 'review' | 'article' | '';
    contentData: ContentData;
    rawContent: JSONContent;
    htmlContent: string;
    status: 'published' | 'draft';
    touched: boolean;
    tagStatus: 'done' | 'loading' | 'error' | 'idle';
    tagOptions: ListOption[];
    selectedTags: ListOption[];
    charCount: number;
    bookStatus: 'done' | 'loading' | 'error' | 'idle';
    bookOptions: ListOption[];
    selectedBook: ListOption | ListOption[];
    themeStatus: 'done' | 'loading' | 'error' | 'idle';
    themeOptions: ListOption[];
    selectedThemes: ListOption[];
}

interface IEditorActions {
    setContentType: (contentType: IEditorState['contentType']) => void;
    fetchTags: () => void;
    createTag: (name: string, authUser: FUser) => void;
    setContentData: (contentData: ContentData) => void;
    setRawContent: (rawContent: JSONContent) => void;
    setHtmlContent: (htmlContent: string) => void;
    setStatus: (status: IEditorState['status']) => void;
    setTouched: (touched: boolean) => void;
    setTagOptions: (tagData?: Tag[]) => void;
    setSelectedTags: (selectedTags: ListOption[]) => void;
    getTitle: () => string;
    getDescription: () => string;
    saveContent: (authUser: FUser, status?: IEditorState['status']) => void;
    triggerDelayedSave: (authUser: FUser) => void;
    setCharCount: (charCount: number) => void;
    determineReadTime: () => number;
    setBookOptions: (bookData?: Book[]) => void;
    setSelectedBook: (selectedBook: ListOption | ListOption[]) => void;
    fetchBooks: () => void;
    resetEditorState: () => void;
    setThemeOptions: (themeData?: Theme[]) => void;
    setSelectedThemes: (selectedThemes: ListOption[]) => void;
    fetchThemes: () => void;
}

const initialEditorState: IEditorState = {
    contentType: '',
    contentData: {
        id: '',
        tagIds: [],
        bookIds: [],
        themeIds: [],
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
    tagStatus: 'idle',
    tagOptions: [],
    selectedTags: [],
    themeStatus: 'idle',
    themeOptions: [],
    selectedThemes: [],
    charCount: 0,
};

export const useEditorStore = create<IEditorState & IEditorActions>()(
    (set, get) => ({
        // State
        ...initialEditorState,
        // Actions
        setContentType: (contentType) => {
            set({ contentType });
        },
        resetEditorState: () => {
            set(initialEditorState);
        },
        fetchThemes: async () => {
            set({ themeStatus: 'loading' });
            themeApi
                .getThemes()
                .then((res) => {
                    useEditorStore.getState().setThemeOptions(res);
                    set({ themeStatus: 'done' });
                })
                .catch(() => {
                    set({ themeStatus: 'error' });
                    toast.error('Error fetching themes');
                });
        },
        setThemeOptions: (themeData) => {
            const { contentData } = get();

            const themeOptions =
                themeData &&
                themeData.map((theme) => ({
                    name: theme.name as string,
                    id: theme.id,
                }));
            set({ themeOptions });

            if (contentData && contentData.themeIds && themeOptions) {
                // if there are themes in the article, set the selected themes
                const selectedThemes = themeOptions.filter((option) =>
                    contentData.themeIds?.includes(option.id),
                );
                set({ selectedThemes });
            }
        },
        setSelectedThemes: (selectedThemes) => {
            set({ selectedThemes });
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
            const { contentData, contentType } = get();

            const bookOptions =
                bookData &&
                bookData.map((book) => ({
                    name: book.title as string,
                    id: book.id,
                }));
            set({ bookOptions });

            if (contentData && bookOptions) {
                if (contentType === 'review') {
                    // if there is a book in the review, set the selected book
                    const selectedBook = bookOptions.find(
                        (option) => option.id === contentData.bookIds,
                    );
                    set({ selectedBook });
                } else if (contentType === 'article') {
                    // if there are books in the article, set the selected books
                    const selectedBooks = bookOptions.filter((option) =>
                        contentData.bookIds?.includes(option.id),
                    );
                    set({ selectedBook: selectedBooks });
                }
            }
        },
        setSelectedBook: (selectedBook) => {
            set({ selectedBook });
        },
        fetchTags: async () => {
            set({ tagStatus: 'loading' });
            tagApi
                .getTags()
                .then((res) => {
                    useEditorStore.getState().setTagOptions(res);
                    set({ tagStatus: 'done' });
                })
                .catch(() => {
                    set({ tagStatus: 'error' });
                    toast.error('Error fetching tags');
                });
        },
        createTag: async (name, authUser) => {
            const { fetchTags } = get();

            tagApi
                .createTag({ name, userUid: authUser?.uid })
                .then(() => {
                    toast.success('Tag created');
                    fetchTags();
                })
                .catch(() => {
                    toast.error('Error creating tag');
                });
        },
        setContentData: (contentData) => {
            set({ contentData });
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
        setTagOptions: (tagData) => {
            const { contentData } = get();

            const tagOptions =
                tagData &&
                tagData.map((tag) => ({
                    name: capitalize(tag.name as string),
                    id: tag.id,
                }));
            set({ tagOptions });

            if (contentData && contentData.tagIds.length > 0 && tagOptions) {
                // if there are tags in the content, set the selected tags
                const selectedTags = tagOptions.filter((tagOption) =>
                    contentData.tagIds.includes(tagOption.id),
                );
                set({ selectedTags });
            }
        },
        setSelectedTags: (selectedTags) => {
            set({ selectedTags });
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
        saveContent: async (authUser, statusParam) => {
            try {
                const {
                    selectedTags,
                    selectedBook,
                    selectedThemes,
                    rawContent,
                    contentData,
                    contentType,
                    status,
                    getTitle,
                    getDescription,
                    setTouched,
                    setContentData,
                    setStatus,
                    setHtmlContent,
                    determineReadTime,
                } = get();

                if (!authUser) {
                    toast.error(
                        `You must be logged in to save a ${contentType}`,
                    );
                    return;
                }

                const htmlContentGen = generateHTML(rawContent, [
                    StarterKit,
                    Document,
                    Underline,
                    Placeholder,
                    TextAlign,
                    Typography,
                ]);

                // find any new tags that were added
                const newTags = selectedTags?.map(({ id }) => id);

                // if the content is an article, create a new article object
                if (contentType === 'article') {
                    const newThemes = selectedThemes?.map(({ id }) => id);

                    const newArticle: SaveArticleParams = {
                        title: getTitle(),
                        description: getDescription(),
                        rawContent,
                        htmlContent: htmlContentGen,
                        status: statusParam || status,
                        tagIds: newTags,
                        themeIds: newThemes,
                        bookIds: (selectedBook as ListOption[]).map(
                            (book) => book.id,
                        ),
                        userUid: authUser.uid,
                        readTime: determineReadTime(),
                    };

                    const updateArticle: SaveArticleParams = {
                        ...newArticle,
                        id: contentData.id,
                    };

                    if (
                        !newArticle.bookIds ||
                        newArticle.bookIds.length === 0
                    ) {
                        toast.error('You must select a book');
                        return;
                    }

                    const savedArticle =
                        contentData.id.length > 0
                            ? await articleApi.updateArticle(updateArticle)
                            : await articleApi.createArticle(newArticle);
                    setContentData({
                        id: savedArticle.id,
                        tagIds: savedArticle.tagIds,
                        bookIds: savedArticle.bookIds,
                        themeIds: savedArticle.themeIds,
                    });
                    setStatus(statusParam || status);
                    setTouched(false);
                    setHtmlContent(savedArticle.htmlContent || '');
                }

                // if the content is a review, create a new review object
                if (contentType === 'review') {
                    const newReview: SaveReviewParams = {
                        title: getTitle(),
                        description: getDescription(),
                        rawContent,
                        htmlContent: htmlContentGen,
                        status: statusParam || status,
                        tagIds: newTags,
                        bookId: (selectedBook as ListOption).id,
                        userUid: authUser.uid,
                        readTime: determineReadTime(),
                    };

                    const updateReview: SaveReviewParams = {
                        ...newReview,
                        id: contentData.id,
                    };

                    if (!newReview.bookId) {
                        toast.error('You must select a book');
                        return;
                    }

                    const savedReview =
                        contentData.id.length > 0
                            ? await reviewApi.updateReview(updateReview)
                            : await reviewApi.createReview(newReview);

                    setContentData({
                        id: savedReview.id,
                        tagIds: savedReview.tagIds,
                        bookIds: savedReview.bookId as string,
                    });
                    setTouched(false);
                    setStatus(statusParam || status);
                    setHtmlContent(savedReview.htmlContent || '');
                }

                toast.success('Saved...');
            } catch (err) {
                toast.error(`Error saving content`);
            }
        },
        triggerDelayedSave: debounce({ delay: 5000 }, (authUser) => {
            const { saveContent } = get();
            saveContent(authUser);
        }),
        setCharCount: (charCount) => {
            set({ charCount });
        },
        determineReadTime: () => {
            const { rawContent } = get();
            // get the text from the document
            const text = rawContent.content
                ?.map((item) => {
                    if (
                        item.type === 'paragraph' ||
                        item.type === 'heading' ||
                        item.type === 'blockquote'
                    ) {
                        return item.content
                            ?.map((node) => {
                                if (node.type === 'text') {
                                    return node.text;
                                }
                                return '';
                            })
                            .join('');
                    }
                    return '';
                })
                .join('');
            // get a word count
            const wordCount = text?.split(' ').length || 0;

            return Math.ceil(wordCount / 200);
        },
    }),
);
