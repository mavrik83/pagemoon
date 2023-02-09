import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const user = await prisma.user
            .delete({
                where: {
                    id: req.query.id as string,
                },
            })
            .catch(() => {
                throw new Error('failed to delete user');
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
        case 'DELETE':
            return deleteUser(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
