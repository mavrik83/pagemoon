import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';

import TipTap from '../../components/tiptap/editor';

const Editor: NextPage = () => {
    const router = useRouter();
    const { user } = useFirebaseAuth();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    return <div>{user && <TipTap isEditable />}</div>;
};

export default Editor;
