import React, { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BsPinFill } from 'react-icons/bs';
import { MdError } from 'react-icons/md';
import { Auth, AuthProps } from '../auth';
import { Container } from '../index';
import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const [mode, setMode] = useState<AuthProps['mode']>('signin');

    return (
        <>
            <Toaster
                toastOptions={{
                    success: {
                        className: 'font-light',
                        icon: <BsPinFill className='text-primary' />,
                        position: 'bottom-right',
                        style: {
                            background: '#3BD96750',
                        },
                        duration: 3000,
                    },
                    error: {
                        className: 'font-light',
                        icon: <MdError className='text-alert' />,
                        position: 'bottom-right',
                        style: {
                            background: '#D93B3B50',
                        },
                        duration: 3000,
                    },
                }}
            />
            <Auth open={authModalOpen} setOpen={setAuthModalOpen} mode={mode} />
            <Header
                authModalOpen={authModalOpen}
                setAuthModalOpen={setAuthModalOpen}
            />
            <Container>{children}</Container>
            <Footer setAuthModalOpen={setAuthModalOpen} setMode={setMode} />
        </>
    );
};
