import { NextApiRequest, NextApiResponse } from 'next';
import { TagCreateRequest } from '.';
import prisma from '../../../lib/prisma';

const createTag = async (req: TagCreateRequest, res: NextApiResponse) => {
    try {
        const user = await prisma.user
            .findFirst({
                where: {
                    authUid: req.body.userUid,
                },
            })
            .catch(() => {
                throw new Error('User not found');
            });

        const tag =
            user &&
            (await prisma.tag
                .create({
                    data: {
                        name: req.body.name,
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                    },
                })
                .catch(() => {
                    throw new Error('failed to create tag');
                }));
        res.status(200).send(tag);
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
            return createTag(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
