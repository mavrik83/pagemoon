import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const getCategories = async (_req: NextApiRequest, res: NextApiResponse) => {
    const categories = await prisma.category.findMany();
    return res.send(categories);
};

const createCategory = async (req: NextApiRequest, res: NextApiResponse) => {
    const category = await prisma.category.create({
        data: {
            name: req.body.name,
        },
    });
    return res.status(200).send(category);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return getCategories(req, res);
        case 'POST':
            return createCategory(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
