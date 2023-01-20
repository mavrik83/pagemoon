import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
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
import { Post } from '@prisma/client';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { classNames } from '../../utils/helpers';
import { Button, SingleMultiSelect } from '../reusable';
import { useEditorStore } from './editor-store';

interface Props {
    // eslint-disable-next-line react/require-default-props
    data?: Post;
    isEditable: boolean;
}

const CustomDocument = Document.extend({
    content: 'heading block*',
});

export const Editor: React.FC<Props> = ({ isEditable, data }) => {
    const { authUser } = useFirebaseAuth();
    const router = useRouter();

    const triggerDelayedSave = useEditorStore(
        useCallback((state) => state.triggerDelayedSave, []),
    );
    const setRawContent = useEditorStore(
        useCallback((state) => state.setRawContent, []),
    );
    const savePost = useEditorStore(useCallback((state) => state.savePost, []));
    const setPostData = useEditorStore(
        useCallback((state) => state.setPostData, []),
    );
    // Category state
    const fetchCategories = useEditorStore(
        useCallback((state) => state.fetchCategories, []),
    );
    const setSelectedCategories = useEditorStore(
        (state) => state.setSelectedCategories,
    );
    const selectedCategories = useEditorStore(
        useCallback((state) => state.selectedCategories, []),
    );
    const options = useEditorStore((state) => state.options);

    const categoryStatus = useEditorStore((state) => state.categoryStatus);

    // Book state
    const fetchBooks = useEditorStore(
        useCallback((state) => state.fetchBooks, []),
    );
    const setSelectedBook = useEditorStore(
        useCallback((state) => state.setSelectedBook, []),
    );
    const selectedBook = useEditorStore((state) => state.selectedBook);
    const bookOptions = useEditorStore(
        useCallback((state) => state.bookOptions, []),
    );
    const bookStatus = useEditorStore(
        useCallback((state) => state.bookStatus, []),
    );

    useEffect(() => {
        if (data) {
            setRawContent(data.rawContent as JSONContent);
            setPostData({
                id: data.id,
                categoryIds: data.categoryIds,
                bookId: data.bookId as string,
            });
        }
        fetchCategories();
        fetchBooks();

        return () => {
            setSelectedBook({ id: '', name: '' });
            setSelectedCategories([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const editor = useEditor({
        editable: !!(isEditable && authUser),
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
                class: 'prose prose-lg prose-neutral my-10 outline-none prose-p:leading-normal prose-li:leading-none prose-h1:text-3xl prose-h1:font-light prose-h2:font-light prose-h3:font-light prose-h2:text-2xl prose-h3:text-xl placeholder-text:text-neutral-500 prose-strong:font-extrabold font-light',
            },
        },
        content: (data?.rawContent as JSONContent) || null,
        onUpdate: (editorObj) => {
            setRawContent(editorObj.editor.getJSON());
            triggerDelayedSave(authUser);
        },
    });

    return (
        <div className='z-30 mt-10'>
            <div className='my-2'>
                {selectedBook.name
                    ? `You are writing a review for ${selectedBook?.name}`
                    : 'Select a book to write a review or add a new book if it is not in the list'}
            </div>
            <div className='flex flex-wrap justify-start gap-5'>
                <Button
                    onClick={() => {
                        savePost(authUser, 'published');
                        router.push('/');
                    }}
                >
                    Publish
                </Button>
                <Button
                    twClasses='!bg-tertiary !bg-opacity-30 !border-tertiary '
                    secondary
                    onClick={() => savePost(authUser, 'draft')}
                >
                    Save as draft
                </Button>
                <SingleMultiSelect
                    selectedOptions={selectedCategories}
                    loadingStatus={categoryStatus}
                    options={options}
                    setSelectedOptions={setSelectedCategories as any}
                    theme='secondary'
                    label='Categories'
                />
                <SingleMultiSelect
                    selectedOptions={selectedBook}
                    loadingStatus={bookStatus}
                    options={bookOptions}
                    setSelectedOptions={setSelectedBook as any}
                    theme='secondary'
                    label='Books'
                    isMulti={false}
                />
            </div>
            <div className='mt-5 flex flex-row flex-wrap gap-3'>
                {selectedCategories.map((category) => (
                    <span
                        key={category.name}
                        className='inline-flex items-center rounded-full bg-secondary bg-opacity-30 px-3 py-0.5 text-sm font-medium'
                    >
                        {category.name}
                    </span>
                ))}
            </div>
            <div>
                {editor && (
                    <div>
                        <BubbleMenu
                            className='flex gap-2 rounded-lg border border-secondary bg-secondary bg-opacity-50 p-1 backdrop-blur-sm focus:rounded-lg '
                            tippyOptions={{ duration: 100, zIndex: 20 }}
                            editor={editor}
                        >
                            <button
                                type='button'
                                onClick={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                className={classNames(
                                    'border-none bg-none px-1 py-0 text-sm font-extrabold opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('bold')
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
                            >
                                <TbBold />
                            </button>
                            <button
                                type='button'
                                onClick={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                className={classNames(
                                    'border-none bg-none px-1 py-0 text-sm font-extrabold opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('italic')
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
                            >
                                <TbItalic />
                            </button>
                            <button
                                type='button'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleUnderline()
                                        .run()
                                }
                                className={classNames(
                                    'border-none bg-none px-1 py-0 text-sm font-extrabold opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('underline')
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
                            >
                                <TbUnderline />
                            </button>
                            <button
                                type='button'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBlockquote()
                                        .run()
                                }
                                className={classNames(
                                    'border-none bg-none px-1 py-0 text-sm font-extrabold opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('blockquote')
                                        ? 'rounded-lg bg-secondary opacity-60'
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
                            className='flex gap-2 rounded-lg border border-secondary bg-secondary bg-opacity-50 p-1 focus:rounded-lg'
                            tippyOptions={{
                                duration: 100,
                                placement: 'bottom-start',
                                zIndex: 20,
                            }}
                            editor={editor}
                        >
                            <button
                                type='button'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 1 })
                                        .run()
                                }
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('heading', { level: 1 })
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
                            >
                                <TbHeading />1
                            </button>
                            <button
                                type='button'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 2 })
                                        .run()
                                }
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('heading', { level: 2 })
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
                            >
                                <TbHeading />2
                            </button>
                            <button
                                type='button'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 3 })
                                        .run()
                                }
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('heading', { level: 3 })
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
                            >
                                <TbHeading />3
                            </button>
                            <button
                                type='button'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('bulletlist')
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
                            >
                                <TbList />
                            </button>
                            <button
                                type='button'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                }
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('orderedlist')
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
                            >
                                <TbListNumbers />
                            </button>
                            <button
                                type='button'
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBlockquote()
                                        .run()
                                }
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('blockquote')
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
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
