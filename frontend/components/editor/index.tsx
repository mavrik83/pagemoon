import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { TbTags } from 'react-icons/tb';
import { IoBookOutline } from 'react-icons/io5';
import { MdOutlineCollectionsBookmark } from 'react-icons/md';
import { Article, Review } from '@prisma/client';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { classNames } from '../../utils/helpers';
import { Button } from '../reusable';
import { useEditorStore } from './editor-store';
import { ComboSelectBox, ListOption } from '../reusable/comboBoxSelect';
import { EditorBubbleMenu } from './components/bubbleMenu';
import { EditorFloatingMenu } from './components/floatingMenu';

interface Props {
    // eslint-disable-next-line react/require-default-props
    data?: Review | Article;
    isEditable: boolean;
}

const CustomDocument = Document.extend({
    content: 'heading block*',
});

export const Editor: React.FC<Props> = ({ isEditable, data }) => {
    const { authUser } = useFirebaseAuth();
    const router = useRouter();

    const contentType = useEditorStore(
        useCallback((state) => state.contentType, []),
    );
    const triggerDelayedSave = useEditorStore(
        useCallback((state) => state.triggerDelayedSave, []),
    );
    const setRawContent = useEditorStore(
        useCallback((state) => state.setRawContent, []),
    );
    const saveContent = useEditorStore(
        useCallback((state) => state.saveContent, []),
    );
    const setContentData = useEditorStore(
        useCallback((state) => state.setContentData, []),
    );
    // Tag state
    const fetchTags = useEditorStore(
        useCallback((state) => state.fetchTags, []),
    );
    const setSelectedTags = useEditorStore((state) => state.setSelectedTags);
    const selectedTags = useEditorStore(
        useCallback((state) => state.selectedTags, []),
    );
    const tagOptions = useEditorStore((state) => state.tagOptions);

    const tagStatus = useEditorStore((state) => state.tagStatus);
    const createTag = useEditorStore(
        useCallback((state) => state.createTag, []),
    );

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

    // Theme state
    const themeOptions = useEditorStore(
        useCallback((state) => state.themeOptions, []),
    );
    const themeStatus = useEditorStore(
        useCallback((state) => state.themeStatus, []),
    );
    const selectedThemes = useEditorStore(
        useCallback((state) => state.selectedThemes, []),
    );
    const setSelectedThemes = useEditorStore(
        useCallback((state) => state.setSelectedThemes, []),
    );
    const fetchThemes = useEditorStore(
        useCallback((state) => state.fetchThemes, []),
    );

    useEffect(() => {
        if (data) {
            setRawContent(data.rawContent as JSONContent);
            setContentData({
                id: data.id,
                tagIds: data.tagIds,
                bookIds: (data as Article).bookIds
                    ? ((data as Article).bookIds as string[]) || []
                    : ((data as Review).bookId as string) || '',
                themeIds: (data as Article).themeIds || [],
            });
        }
        fetchTags();
        fetchBooks();
        if (contentType === 'article') {
            fetchThemes();
        }

        return () => {
            if (contentType === 'article') {
                setSelectedThemes([]);
                setSelectedBook([] as ListOption[]);
            }
            setSelectedBook({ id: '', name: '' });
            setSelectedTags([]);
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
                    if (node.type.name === 'paragraph') {
                        return 'Start writing...';
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
        <div className='z-30 mt-10 gap-2 lg:grid lg:grid-cols-5'>
            <div className='min-h-screen rounded-lg bg-primary bg-opacity-5 p-3 lg:col-span-3'>
                <div className='flex flex-wrap items-center justify-start gap-5'>
                    <Button
                        onClick={() => {
                            saveContent(authUser, 'published');
                            router.push('/');
                        }}
                    >
                        Publish
                    </Button>
                    <Button
                        twClasses='!bg-tertiary !bg-opacity-30 !border-tertiary '
                        secondary
                        onClick={() => saveContent(authUser, 'draft')}
                    >
                        Save as draft
                    </Button>
                    <ComboSelectBox
                        selectedOptions={selectedTags}
                        loadingStatus={tagStatus}
                        options={tagOptions}
                        setSelectedOptions={setSelectedTags as any}
                        theme='secondary'
                        label='Tags'
                        creatable
                        createCallback={createTag}
                    />
                    {contentType === 'article' && (
                        <ComboSelectBox
                            selectedOptions={selectedThemes}
                            loadingStatus={themeStatus}
                            options={themeOptions}
                            setSelectedOptions={setSelectedThemes as any}
                            theme='secondary'
                            label='Themes'
                        />
                    )}
                    <ComboSelectBox
                        selectedOptions={selectedBook}
                        loadingStatus={bookStatus}
                        options={bookOptions}
                        setSelectedOptions={setSelectedBook as any}
                        theme='secondary'
                        label='Books'
                        isMulti={contentType === 'article'}
                    />
                </div>
                <div
                    className={classNames(
                        (selectedBook as ListOption).name ||
                            (selectedBook as ListOption[]).length
                            ? ''
                            : 'hidden',
                        'mt-5 flex flex-row flex-wrap items-center gap-3',
                    )}
                >
                    <IoBookOutline className='text-2xl text-tertiary' />
                    {contentType === 'review' && (
                        <span className='inline-flex items-center rounded-full bg-tertiary bg-opacity-30 px-3 py-0.5 text-sm '>
                            {(selectedBook as ListOption).name}
                        </span>
                    )}
                    {contentType === 'article' &&
                        Array.isArray(selectedBook) &&
                        (selectedBook as ListOption[]).map((book) => (
                            <span
                                key={book.name}
                                className='inline-flex items-center rounded-full bg-tertiary bg-opacity-30 px-3 py-0.5 text-sm '
                            >
                                {book.name}
                            </span>
                        ))}
                </div>
                <div
                    className={classNames(
                        selectedTags.length > 0 ? '' : 'hidden',
                        'mt-5 flex items-center gap-3',
                    )}
                >
                    <TbTags className='shrink-0 grow-0 text-2xl text-secondary' />
                    <div className='flex flex-row flex-wrap items-center gap-3'>
                        {selectedTags.map((tag) => (
                            <span
                                key={tag.name}
                                className='inline-flex items-center rounded-full bg-secondary bg-opacity-30 px-3 py-0.5 text-sm '
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div
                    className={classNames(
                        selectedThemes.length > 0 ? '' : 'hidden',
                        'mt-5 flex items-center gap-3',
                    )}
                >
                    <MdOutlineCollectionsBookmark className='shrink-0 grow-0 text-2xl text-secondary' />
                    <div className='flex flex-row flex-wrap items-center gap-3'>
                        {selectedThemes.map((theme) => (
                            <span
                                key={theme.name}
                                className='inline-flex items-center rounded-full bg-secondary bg-opacity-30 px-3 py-0.5 text-sm '
                            >
                                {theme.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    {editor && <EditorBubbleMenu editor={editor} />}
                    {editor && <EditorFloatingMenu editor={editor} />}
                    <EditorContent editor={editor} />
                </div>
            </div>
            <div className='hidden space-y-2 lg:col-span-1 lg:block'>
                <div className='rounded-lg bg-primary bg-opacity-30 p-3 text-sm'>
                    <p className=''>
                        This is a &lsquo;block&rsquo; style editor. It is
                        similar to a wordprocessor, but with some added
                        constraints to make it easier to use and easier to
                        create consistent content.
                    </p>
                </div>
                <div className='rounded-lg bg-primary bg-opacity-30 p-3 text-sm'>
                    <p>
                        Click inside the editor to start editing. This editor
                        requires the first block to be a heading.
                    </p>
                </div>
                <div className='rounded-lg bg-primary bg-opacity-30 p-3 text-sm'>
                    <p>
                        Push enter to create a new &lsquo;block&rsquo; of text.
                        A block can be a paragraph, a heading, a list, or a
                        quote. A menu will appear above the block to let you
                        change the type of block.
                    </p>
                </div>
                <div className='rounded-lg bg-primary bg-opacity-30 p-3 text-sm'>
                    <p>
                        Once you have created a block and added some text, you
                        can highlight some text and a formatting menu will
                        appear. This menu lets you change the style of the text.
                        The options here are bold, italic, and underline.
                    </p>
                </div>
            </div>
            <div className='hidden space-y-2 lg:col-span-1 lg:block'>
                {contentType === 'review' ? (
                    <div className='rounded-lg bg-secondary bg-opacity-30 p-3 text-sm'>
                        <p className=''>
                            This a review of a book. You can add a book to the
                            review by selecting it from the dropdown menu. A
                            review can only have one book associated with it.
                        </p>
                    </div>
                ) : (
                    <div className='rounded-lg bg-secondary bg-opacity-30 p-3 text-sm'>
                        <p className=''>
                            This is an article. You can add multiple books and
                            themes to an article. Articles are content that can
                            span many themes and books. Use them to write about
                            a topic that is not specific to a single book or
                            theme.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
