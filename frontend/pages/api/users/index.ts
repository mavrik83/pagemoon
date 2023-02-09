import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const getUsers = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const users = await prisma.user.findMany().catch(() => {
            throw new Error('failed to get users');
        });

        res.send(users);
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
            return getUsers(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
