import React, { FC } from 'react';
import { Editor, FloatingMenu } from '@tiptap/react';
import {
    TbHeading,
    TbList,
    TbListNumbers,
    TbBlockquote,
    TbCursorText,
} from 'react-icons/tb';
import { classNames } from '../../../utils/helpers';

interface Props {
    editor: Editor;
}

export const EditorFloatingMenu: FC<Props> = ({ editor }: Props) => (
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
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={classNames(
                    'inline-flex items-center justify-center border-none bg-none px-1 py-0 text-sm font-medium opacity-80 hover:rounded-lg hover:bg-secondary hover:opacity-100 active:opacity-100',
                    editor.isActive('paragraph')
                        ? 'rounded-lg bg-secondary opacity-60'
                        : '',
                )}
            >
                <TbCursorText />
            </button>
            <button
                type='button'
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
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
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
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
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
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
                onClick={() => editor.chain().focus().toggleBulletList().run()}
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
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
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
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
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
);
