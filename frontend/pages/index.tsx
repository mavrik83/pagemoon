import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Card, Container, Text } from '@nextui-org/react';
import { User, Book } from '@prisma/client';
import { userApi, bookApi } from '../utils/api';

interface Props {
    users: User[];
    books: Book[];
}

export const getStaticProps = async () => {
    const users = await userApi.getUsers();
    const books = await bookApi.getBooks();
    return {
        props: {
            users,
            books,
        },
    };
};

const Home: NextPage<Props> = ({ users, books }: Props) => (
    <div>
        <Head>
            <title>PageMoon</title>
            <meta name="description" content="Future home of PageMoon" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container
            css={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                h: '60vh',
            }}
        >
            <Text size="1.50rem">Welcome to the future home of:</Text>
            <Text size="3rem">PageMoon</Text>
            {users && <Text>{users[0].firstName}</Text>}

            {books &&
                books.map((book) => (
                    <Card key={book.id} css={{ w: '200px' }}>
                        <Card.Header>
                            <Text size="1.5rem">{book.title}</Text>
                        </Card.Header>
                        <Card.Body>
                            <Text size=".8rem">{book.author}</Text>
                            <Text size=".8rem">{book.language}</Text>
                            <Text size=".8rem">{book.isbn}</Text>
                            <Text size=".8rem">{book.publisher}</Text>
                        </Card.Body>
                    </Card>
                ))}
        </Container>
    </div>
);

export default Home;
