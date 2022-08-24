import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const getPosts = async (_req: NextApiRequest, res: NextApiResponse) => {
    const posts = await prisma.post.findMany();
    return res.send(posts);
};

const upsertPost = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body.id) {
        const post = await prisma.post.create({
            data: {
                ...req.body,
            },
        });
        return res.status(200).send(post);
    }
    const post = await prisma.post.update({
        where: { id: req.body.id },
        data: {
            title: req.body.title,
            description: req.body.description,
            rawContent: req.body.rawContent,
            draftMode: req.body.draftMode,
        },
    });
    return res.status(200).send(post);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return getPosts(req, res);
        case 'POST':
            return upsertPost(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
