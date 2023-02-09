import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const findUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const user = await prisma.user
            .findFirst({
                where: {
                    authUid: req.query.id as string,
                },
            })
            .catch(() => {
                throw new Error('failed to find user');
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

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const user = await prisma.user
            .findFirst({
                where: {
                    authUid: req.query.id as string,
                },
            })
            .catch(() => {
                throw new Error('failed to find user');
            });

        if (user === null) {
            throw new Error('user not found');
        }

        const updatedUser = await prisma.user
            .update({
                where: {
                    id: user.id,
                },
                data: {
                    ...req.body,
                },
            })
            .catch(() => {
                throw new Error('failed to update user');
            });

        res.status(200).send(updatedUser);
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
            return findUser(req, res);
        case 'PUT':
            return updateUser(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
