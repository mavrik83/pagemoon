import { Post } from '@prisma/client';

export interface IPostPreview extends Partial<Post> {
    user: {
        firstName: string;
    };
    tags: {
        name: string;
    }[];
    book: {
        title: string;
        isbn: string;
        coverImage?: string;
    };
}
