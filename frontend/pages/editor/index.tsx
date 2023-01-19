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

    const resetEditorState = useEditorStore((state) => state.resetEditorState);
    const resetBookState = useBookStore((state) => state.resetBookState);

    useEffect(() => {
        resetEditorState();
        resetBookState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, router, authLoading]);

    return <div>{authUser && <Editor isEditable />}</div>;
};

export default EditorNew;
