import React, { useState, useEffect } from 'react';
import {
    useEditor,
    EditorContent,
    BubbleMenu,
    FloatingMenu,
    JSONContent,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import {
    TbBlockquote,
    TbItalic,
    TbBold,
    TbHeading,
    TbList,
    TbListNumbers,
    TbUnderline,
} from 'react-icons/tb';
import toast from 'react-hot-toast';
import { Category, Post } from '@prisma/client';
import { OnChangeValue } from 'react-select';
import { classNames } from '../../utils/helpers';
import Button from '../button';
import { ComboBox, IOption } from '../combobox';
import { useDebounce, useAsync } from '../../utils/hooks';
import { postApi, categoryApi } from '../../utils/api';

interface Props {
    // eslint-disable-next-line react/require-default-props
    renderContent?: Post;
    isEditable: boolean;
}

interface IState {
    postId: string;
    rawContent: JSONContent;
    draftMode: boolean;
    touched: boolean;
    categoryIds: string[];
    categorySelect: {
        options: IOption[];
        value: Partial<Category>[];
    };
}

const CustomDocument = Document.extend({
    content: 'heading block*',
});

const TipTap: React.FC<Props> = ({ isEditable, renderContent }) => {
    const [state, setState] = useState<IState>({
        // initial state
        postId: '',
        rawContent: (renderContent?.rawContent as JSONContent) || {},
        draftMode: true,
        touched: false,
        categoryIds: [],
        categorySelect: {
            options: [],
            value: [],
        },
    });

    const debouncedState = useDebounce(state, 5000);

    const {
        data: categoryData,
        error: categoryError,
        status: categoryFetchStatus,
        execute: fetchCategories,
    } = useAsync(categoryApi.getCategories, true);

    if (categoryFetchStatus === 'error' && categoryError) {
        toast.error(categoryError);
    }

    useEffect(() => {
        if (categoryData) {
            const options = categoryData.map((category: Category) => ({
                value: category.id,
                label: category.name!,
            }));

            setState((prevState) => ({
                ...prevState,
                categorySelect: {
                    ...prevState.categorySelect,
                    options,
                },
            }));
        }
    }, [categoryData]);

    const handleCategorySelect = (value: OnChangeValue<IOption, true>) => {
        const categoryIds = value.map((option: IOption) => option.value);
        setState((prevState) => ({
            ...prevState,
            categoryIds,
        }));
    };

    const handleCategoryCreate = async (inputValue: string) => {
        categoryApi
            .createCategory({
                name: inputValue,
            })
            .then(() => {
                toast.success('Category created');
                fetchCategories();
            })
            .catch(() => {
                toast.error('Error creating category');
            });
    };

    const getTitle = () => {
        const documentContent = state && state.rawContent.content;
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
    };

    const getDescription = () => {
        const documentContent = state && state.rawContent.content;
        // get the first paragraph of the document
        const preview = documentContent?.find(
            (item) => item.type === 'paragraph',
        );
        // deeply iterate through previewDescription to get the value of all text properties and join them in string
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
    };

    const savePost = async (draftMode?: IState['draftMode']) => {
        try {
            const newPost: Partial<Post> = {
                title: getTitle(),
                description: getDescription(),
                rawContent: debouncedState.rawContent,
                draftMode: draftMode || debouncedState.draftMode,
            };

            const updatePost: Partial<Post> = {
                ...newPost,
                id: debouncedState.postId,
            };

            const savedPost = await postApi.upsertPost(
                debouncedState.postId ? updatePost : newPost,
            );

            setState((prevState) => ({
                ...prevState,
                postId: savedPost.id,
                draftMode: draftMode || debouncedState.draftMode,
            }));

            toast.success('Saved...');
            return true;
        } catch (err: any) {
            toast.error(`Error: ${err.message}`);
            return false;
        }
    };

    useEffect(() => {
        // only update if touched
        if (debouncedState.touched) {
            savePost().then(() => {
                setState((prevState) => ({
                    ...prevState,
                    touched: false,
                }));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedState]);

    const editor = useEditor({
        editable: isEditable,
        extensions: [
            CustomDocument,
            StarterKit.configure({ document: false }),
            Underline,
            Typography,
            TextAlign,
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        return 'Start with a title...';
                    }

                    return 'Can you add some further context?';
                },
            }),
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-stone my-10 outline-none prose-p:leading-none prose-li:leading-none prose-h1:text-3xl prose-h1:font-light prose-h2:font-light prose-h3:font-light prose-h2:text-2xl prose-h3:text-xl placeholder-text:text-gray-500 prose-strong:font-extrabold font-light',
            },
        },
        content: renderContent || null,
        onUpdate: (editorObj) => {
            const rawContent = editorObj.editor.getJSON();
            setState((prevState: IState) => ({
                ...prevState,
                rawContent,
                touched: true,
            }));
        },
    });

    return (
        <div className="z-30 mt-10">
            <div className="flex flex-wrap justify-start gap-5">
                <Button onClick={() => savePost(false)}>Publish</Button>
                <Button
                    twClasses="bg-tertiary !border-tertiary"
                    secondary
                    onClick={() => savePost(true)}
                >
                    Save as draft
                </Button>
                {!categoryError && categoryData && (
                    <div>
                        <ComboBox
                            options={state.categorySelect.options}
                            changeHandler={handleCategorySelect}
                            createHandler={handleCategoryCreate}
                        />
                    </div>
                )}

                <Button secondary twClasses=" bg-tertiary !border-tertiary">
                    Add Selected
                </Button>
            </div>
            <div>
                {editor && (
                    <div>
                        <BubbleMenu
                            className="flex gap-2 p-1 bg-opacity-50 border rounded-lg bg-secondary border-secondary backdrop-blur-sm focus:rounded-lg "
                            tippyOptions={{ duration: 100, zIndex: 20 }}
                            editor={editor}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                className={classNames(
                                    'px-1 py-0 text-sm font-extrabold text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg',
                                    editor.isActive('bold')
                                        ? 'bg-secondary opacity-60 rounded-lg'
                                        : '',
                                )}
                            >
                                <TbBold />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                className={classNames(
                                    'px-1 py-0 text-sm font-extrabold text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg',
                                    editor.isActive('italic')
                                        ? 'bg-secondary opacity-60 rounded-lg'
                                        : '',
                                )}
                            >
                                <TbItalic />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleUnderline()
                                        .run()
                                }
                                className={classNames(
                                    'px-1 py-0 text-sm font-extrabold text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg',
                                    editor.isActive('underline')
                                        ? 'bg-secondary opacity-60 rounded-lg'
                                        : '',
                                )}
                            >
                                <TbUnderline />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBlockquote()
                                        .run()
                                }
                                className={classNames(
                                    'px-1 py-0 text-sm font-extrabold text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg',
                                    editor.isActive('blockquote')
                                        ? 'bg-secondary opacity-60 rounded-lg'
                                        : '',
                                )}
                            >
                                <TbBlockquote />
                            </button>
                        </BubbleMenu>
                    </div>
                )}

                {editor && (
                    <div>
                        <FloatingMenu
                            className="flex gap-2 p-1 bg-opacity-50 border rounded-lg bg-secondary border-secondary focus:rounded-lg"
                            tippyOptions={{
                                duration: 100,
                                placement: 'bottom-start',
                                zIndex: 20,
                            }}
                            editor={editor}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 1 })
                                        .run()
                                }
                                className="inline-flex items-center justify-center px-1 py-0 text-sm font-medium text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg"
                            >
                                <TbHeading />1
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 2 })
                                        .run()
                                }
                                className="inline-flex items-center justify-center px-1 py-0 text-sm font-medium text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg"
                            >
                                <TbHeading />2
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 3 })
                                        .run()
                                }
                                className="inline-flex items-center justify-center px-1 py-0 text-sm font-medium text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg"
                            >
                                <TbHeading />3
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                                className="inline-flex items-center justify-center px-1 py-0 text-sm font-medium text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg"
                            >
                                <TbList />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                }
                                className="inline-flex items-center justify-center px-1 py-0 text-sm font-medium text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg"
                            >
                                <TbListNumbers />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBlockquote()
                                        .run()
                                }
                                className="px-1 py-0 text-sm font-extrabold text-black border-none bg-none opacity-80 hover:opacity-100 active:opacity-100 hover:bg-secondary hover:rounded-lg"
                            >
                                <TbBlockquote />
                            </button>
                        </FloatingMenu>
                    </div>
                )}

                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default TipTap;
