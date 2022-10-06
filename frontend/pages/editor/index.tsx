import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';

import { TipTap } from '../../components/tiptap/editor';

const Editor: NextPage = () => {
    const router = useRouter();
    const { authUser, authLoading } = useFirebaseAuth();

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, router, authLoading]);

    return <div>{authUser && <TipTap isEditable />}</div>;
};

export default Editor;
