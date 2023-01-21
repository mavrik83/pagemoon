import { Post } from '@prisma/client';

export interface IPostPreview extends Partial<Post> {
    user: {
        firstName: string;
    };
    categories: {
        name: string;
    }[];
    book: {
        title: string;
        isbn: string;
    };
}
