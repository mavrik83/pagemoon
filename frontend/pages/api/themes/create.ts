import { NextApiRequest, NextApiResponse } from 'next';
import { ThemeCreateRequest } from '.';
import prisma from '../../../lib/prisma';

const createTheme = async (req: ThemeCreateRequest, res: NextApiResponse) => {
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

        const theme =
            user &&
            (await prisma.theme
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
                    throw new Error('failed to create theme');
                }));
        res.status(200).send(theme);
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
            return createTheme(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
