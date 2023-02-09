import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SaveBookParams } from '../../../utils/api/bookApi';

export interface BookCreateRequest extends NextApiRequest {
    body: SaveBookParams;
}

const getAllBooks = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const books = await prisma.book
            .findMany({
                orderBy: {
                    title: 'asc',
                },
            })
            .catch(() => {
                throw new Error('failed to get books');
            });

        res.status(200).send(books);
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
            return getAllBooks(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
