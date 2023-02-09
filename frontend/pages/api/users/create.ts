import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const user = await prisma.user
            .create({
                data: {
                    ...req.body,
                },
            })
            .catch(() => {
                throw new Error('failed to create user');
            });

        res.status(200).send(user);
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
        case 'POST':
            return createUser(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
