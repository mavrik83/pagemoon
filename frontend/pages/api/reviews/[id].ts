import { NextApiRequest, NextApiResponse } from 'next';

const getSingleReview = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const review = await prisma.review
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
                include: {
                    book: true,
                    tags: true,
                },
            })
            .catch(() => {
                throw new Error('Review not found');
            });

        const reviewResponse = {
            ...review,
            bookIds: [review?.book?.id],
            tagIds: review?.tags.map((tag) => tag.id),
        };

        res.status(200).send(reviewResponse);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return getSingleReview(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
