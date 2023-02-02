import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { useEditorStore } from '../../components/editor/editor-store';
import { useBookStore } from '../../components/addBook/book-store';
import { Editor } from '../../components/editor';

const EditorNew: NextPage = () => {
    const router = useRouter();
    const { authUser, authLoading } = useFirebaseAuth();

    const setContentType = useEditorStore((state) => state.setContentType);
    const resetEditorState = useEditorStore((state) => state.resetEditorState);
    const resetBookState = useBookStore((state) => state.resetBookState);
    const fetchTags = useEditorStore((state) => state.fetchTags);
    const fetchBooks = useEditorStore((state) => state.fetchBooks);
    const fetchThemes = useEditorStore((state) => state.fetchThemes);

    useEffect(() => {
        resetEditorState();
        resetBookState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/');
        }
        if (router.query.type === 'article') {
            resetEditorState();
            resetBookState();
            fetchTags();
            fetchBooks();
            fetchThemes();
            setContentType('article');
        }

        if (router.query.type === 'review') {
            resetEditorState();
            resetBookState();
            fetchTags();
            fetchBooks();
            setContentType('review');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, router, authLoading, setContentType]);

    return <div>{authUser && <Editor isEditable />}</div>;
};

export default EditorNew;
