import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { BsPinFill } from 'react-icons/bs';
import { MdError } from 'react-icons/md';
import { Container } from '../index';
import { Header } from './Header';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
    <>
        <Toaster
            toastOptions={{
                success: {
                    className: 'font-light',
                    icon: <BsPinFill className="text-primary" />,
                    position: 'bottom-right',
                    style: {
                        background: '#3BD96750',
                    },
                    duration: 3000,
                },
                error: {
                    className: 'font-light',
                    icon: <MdError className="text-alert" />,
                    position: 'bottom-right',
                    style: {
                        background: '#D93B3B50',
                    },
                    duration: 3000,
                },
            }}
        />
        <Header />
        <Container>{children}</Container>
    </>
);
