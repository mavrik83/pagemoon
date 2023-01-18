import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
