import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SaveReviewParams } from '../../../utils/api/reviewApi';

export interface ReviewCreatRequest extends NextApiRequest {
    body: SaveReviewParams;
}

const getAllReviews = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const reviews = await prisma.review.findMany().catch(() => {
            throw new Error('failed to get reviews');
        });

        res.send(reviews);
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
            return getAllReviews(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
