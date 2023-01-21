import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import { IsbnDbResponse } from '../../../models/books';

const { ISBNDB_API_KEY } = process.env as { [key: string]: string };

const isbnDbConfigBase: AxiosRequestConfig = {
    baseURL: 'https://api2.isbndb.com',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `${ISBNDB_API_KEY}`,
    },
};

const searchIsbnDb = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const response = await axios.get<null, IsbnDbResponse>(
            `/book/${req.query.q}`,
            isbnDbConfigBase,
        );

        res.status(200).send(response.data);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

export default searchIsbnDb;
