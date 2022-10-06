import React, { useCallback, useEffect } from 'react';
import {
    useEditor,
    EditorContent,
    BubbleMenu,
    FloatingMenu,
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
import { useFirebaseAuth } from '../../../../utils/contexts/firebaseProvider';
import { classNames } from '../../../../utils/helpers';
import Button from '../../../../components/button';
import { ComboBox } from '../../../../components/combobox';
import { useEditorStore } from './editor-store';

interface Props {
    // eslint-disable-next-line react/require-default-props
    renderContent?: Post;
    isEditable: boolean;
}

const CustomDocument = Document.extend({
    content: 'heading block*',
});

const TipTap: React.FC<Props> = ({ isEditable, renderContent }) => {
    const { authUser } = useFirebaseAuth();

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

    useEffect(() => {
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
        content: renderContent || null,
        onUpdate: (editorObj) => {
            setRawContent(editorObj.editor.getJSON());
            triggerDelayedSave(authUser);
        },
    });

    return (
        <div className="z-30 mt-10">
            <div className="flex flex-wrap justify-start gap-5">
                <Button onClick={() => savePost(authUser, false)}>
                    Publish
                </Button>
                <Button
                    twClasses="bg-tertiary !border-tertiary"
                    secondary
                    onClick={() => savePost(authUser, true)}
                >
                    Save as draft
                </Button>
                <div>
                    <ComboBox />
                </div>
                {/* {state.pendingCategoryIds.length > 0 && (
                    <Button secondary twClasses=" bg-tertiary !border-tertiary">
                        Add Selected
                    </Button>
                )} */}
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
