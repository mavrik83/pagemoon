import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SaveTagParams } from '../../../utils/api/tagApi';

export interface TagCreateRequest extends NextApiRequest {
    body: SaveTagParams;
}

const getTags = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tags = await prisma.tag.findMany().catch(() => {
            throw new Error('failed to get tags');
        });

        res.send(tags);
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
            return getTags(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
