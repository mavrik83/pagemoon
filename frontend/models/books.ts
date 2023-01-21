export interface IsbnBookModel {
    title?: string;
    title_long?: string;
    isbn?: string;
    isbn13?: string;
    dewey_decimal?: string;
    binding?: string;
    publisher?: string;
    language?: string;
    date_published?: string;
    edition?: string;
    pages?: number;
    dimensions?: string;
    overview?: string;
    image?: string;
    msrp?: number;
    excerpt?: string;
    synopsis?: string;
    authors?: string[];
    subjects?: string[];
    reviews?: string[];
    prices?: {
        condition?: string;
        merchant?: string;
        merchant_logo?: string;
        merchant_logo_offset?: {
            x?: string;
            y?: string;
        };
        shipping?: string;
        price?: string;
        total?: string;
        link?: string;
    }[];
    related?: {
        type?: string;
    };
}

export interface IsbnBook {
    book: IsbnBookModel;
}

export interface IsbnDbResponse {
    data: IsbnBook;
}
