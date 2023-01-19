import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';

import { Editor } from '../../components/editor';

const EditorNew: NextPage = () => {
    const router = useRouter();
    const { authUser, authLoading } = useFirebaseAuth();

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, router, authLoading]);

    return <div>{authUser && <Editor isEditable />}</div>;
};

export default EditorNew;
