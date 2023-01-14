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
import Button from '../button';
import { CategorySelect } from '../categorySelect';
import { useEditorStore } from './editor-store';

interface Props {
    // eslint-disable-next-line react/require-default-props
    data?: Post;
    isEditable: boolean;
}

const CustomDocument = Document.extend({
    content: 'heading block*',
});

export const TipTap: React.FC<Props> = ({ isEditable, data }) => {
    const { authUser } = useFirebaseAuth();
    const router = useRouter();

    const selectedCategories = useEditorStore(
        useCallback((state) => state.selectedCategories, []),
    );
    const triggerDelayedSave = useEditorStore(
        useCallback((state) => state.triggerDelayedSave, []),
    );
    const fetchCategories = useEditorStore(
        useCallback((state) => state.fetchCategories, []),
    );
    const setRawContent = useEditorStore(
        useCallback((state) => state.setRawContent, []),
    );
    const savePost = useEditorStore(useCallback((state) => state.savePost, []));
    const setCharCount = useEditorStore(
        useCallback((state) => state.setCharCount, []),
    );
    const setPostData = useEditorStore(
        useCallback((state) => state.setPostData, []),
    );

    useEffect(() => {
        if (data) {
            setRawContent(data.rawContent as JSONContent);
            setPostData({ id: data.id, categoryIds: data.categoryIds });
        }
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        content: (data?.rawContent as JSONContent) || null,
        onUpdate: (editorObj) => {
            setRawContent(editorObj.editor.getJSON());
            setCharCount(editorObj.editor.getText().length);
            triggerDelayedSave(authUser);
        },
    });

    return (
        <div className="z-30 mt-10">
            <div className="flex flex-wrap justify-start gap-5">
                <Button
                    onClick={() => {
                        savePost(authUser, 'published');
                        router.push('/');
                    }}
                >
                    Publish
                </Button>
                <Button
                    twClasses="bg-tertiary !border-tertiary"
                    secondary
                    onClick={() => savePost(authUser, 'draft')}
                >
                    Save as draft
                </Button>
                <CategorySelect />
            </div>
            <div className="mt-5 flex flex-row gap-3">
                {selectedCategories.map((category) => (
                    <span
                        key={category.name}
                        className="inline-flex items-center rounded-full bg-secondary bg-opacity-30 px-3 py-0.5 text-sm font-medium text-gray-800"
                    >
                        {category.name}
                    </span>
                ))}
            </div>
            <div>
                {editor && (
                    <div>
                        <BubbleMenu
                            className="flex gap-2 rounded-lg border border-secondary bg-secondary bg-opacity-50 p-1 backdrop-blur-sm focus:rounded-lg "
                            tippyOptions={{ duration: 100, zIndex: 20 }}
                            editor={editor}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                className={classNames(
                                    'border-none bg-none px-1 py-0 text-sm font-extrabold text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('bold')
                                        ? 'rounded-lg bg-secondary opacity-60'
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
                                    'border-none bg-none px-1 py-0 text-sm font-extrabold text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('italic')
                                        ? 'rounded-lg bg-secondary opacity-60'
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
                                    'border-none bg-none px-1 py-0 text-sm font-extrabold text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('underline')
                                        ? 'rounded-lg bg-secondary opacity-60'
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
                                    'border-none bg-none px-1 py-0 text-sm font-extrabold text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
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
                            className="flex gap-2 rounded-lg border border-secondary bg-secondary bg-opacity-50 p-1 focus:rounded-lg"
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
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('heading', { level: 1 })
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
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
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('heading', { level: 2 })
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
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
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('heading', { level: 3 })
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
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
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('bulletlist')
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
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
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                                    editor.isActive('orderedlist')
                                        ? 'rounded-lg bg-secondary opacity-60'
                                        : '',
                                )}
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
                                className={classNames(
                                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium text-black opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
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
