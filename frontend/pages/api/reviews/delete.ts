import { NextApiRequest, NextApiResponse } from 'next';

const deleteReview = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tags = await prisma.review
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
                include: {
                    tags: true,
                },
            })
            .tags();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const review = await prisma.review.update({
            where: {
                id: req.query.id as string,
            },
            data: {
                tags: {
                    disconnect: tags.map((tag) => ({
                        id: tag.id,
                    })),
                },
                user: {
                    disconnect: true,
                },
            },
        });

        const deletedReview = await prisma.review.delete({
            where: {
                id: req.query.id as string,
            },
        });

        res.status(200).send(deletedReview);
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
        case 'DELETE':
            return deleteReview(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
