import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Review } from '@prisma/client';
import { useFirebaseAuth } from '../../../utils/contexts/firebaseProvider';
import { Editor } from '../../../components/editor';
import { reviewApi } from '../../../utils/api';

const EditorEdit: NextPage = () => {
    const router = useRouter();
    const { authUser, authLoading } = useFirebaseAuth();
    const [review, setReview] = React.useState<Review>();

    const { id } = router.query;

    useEffect(() => {
        reviewApi.getReviewById(id as string).then((res) => setReview(res));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, router, authLoading]);

    return (
        <div>{authUser && review && <Editor isEditable data={review} />}</div>
    );
};

export default EditorEdit;
