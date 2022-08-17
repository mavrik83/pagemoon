import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const getUsers = async (_req: NextApiRequest, res: NextApiResponse) => {
    const users = await prisma.user.findMany();
    return res.send(users);
};

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await prisma.user.create({
        data: {
            ...req.body,
        },
    });
    return res.send(user);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return getUsers(req, res);
        case 'POST':
            return createUser(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
