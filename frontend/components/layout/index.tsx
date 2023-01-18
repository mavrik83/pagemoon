import React, { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BsPinFill } from 'react-icons/bs';
import { MdError } from 'react-icons/md';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { twc } from '../../utils/helpers';
import AddBook from '../addBook';
import { Auth, AuthProps } from '../auth';
import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
    children: ReactNode;
}

const containerClasses = twc`
    max-w-7xl
    mx-auto
    min-h-screen
    px-4
    sm:px-6
    lg:px-8
`;

export const Layout = ({ children }: LayoutProps) => {
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const [addBookModalOpen, setAddBookModalOpen] = useState(false);

    const [mode, setMode] = useState<AuthProps['mode']>('signin');

    const { authUser } = useFirebaseAuth();

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

            <AddBook open={addBookModalOpen} setOpen={setAddBookModalOpen} />
            <Header
                addBookModalOpen={addBookModalOpen}
                setAddBookModalOpen={setAddBookModalOpen}
            />
            <div className={containerClasses}>{children}</div>
            <Footer setAuthModalOpen={setAuthModalOpen} setMode={setMode} />
        </>
    );
};
