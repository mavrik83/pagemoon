import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Post } from '@prisma/client';
import { useFirebaseAuth } from '../../../utils/contexts/firebaseProvider';
import { TipTap } from '../../../components/tiptap/editor';
import { postApi } from '../../../utils/api';

const Editor: NextPage = () => {
    const router = useRouter();
    const { authUser, authLoading } = useFirebaseAuth();
    const [post, setPost] = React.useState<Post>();

    const { id } = router.query;

    useEffect(() => {
        postApi.getPostById(id as string).then((res) => setPost(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, router, authLoading]);

    return <div>{authUser && post && <TipTap isEditable data={post} />}</div>;
};

export default Editor;
