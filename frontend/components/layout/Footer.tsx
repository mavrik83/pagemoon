import Link from 'next/link';
import React, { FC } from 'react';
import toast from 'react-hot-toast';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { AuthProps } from '../auth';

interface Props {
    setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setMode: React.Dispatch<React.SetStateAction<AuthProps['mode']>>;
}

export const Footer: FC<Props> = ({ setAuthModalOpen, setMode }) => {
    const { authUser, auth } = useFirebaseAuth();

    return (
        <footer className='sticky top-[100vh] bg-white'>
            <div className='mx-auto max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8'>
                <nav
                    className='-mb-6 flex columns-2 justify-center space-x-5 sm:space-x-12'
                    aria-label='Footer'
                >
                    <Link href='/' className='pb-6'>
                        <a
                            href='/'
                            className='text-sm leading-6 text-neutral-600 hover:text-neutral-900'
                        >
                            Home
                        </a>
                    </Link>
                    <Link href='/posts' className='pb-6'>
                        <a
                            href='/posts'
                            className='text-sm leading-6 text-neutral-600 hover:text-neutral-900'
                        >
                            All Reviews
                        </a>
                    </Link>
                    {authUser && (
                        <Link href='/editor' className='pb-6'>
                            <a
                                href='/editor'
                                className='text-sm leading-6 text-neutral-600 hover:text-neutral-900'
                            >
                                Create New
                            </a>
                        </Link>
                    )}
                    {!authUser ? (
                        <>
                            <button
                                type='button'
                                className='cursor-pointer pb-6 text-sm leading-6 text-neutral-600 hover:text-neutral-900'
                                onClick={() => {
                                    setMode('signin');
                                    setAuthModalOpen(true);
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                type='button'
                                className='cursor-pointer pb-6 text-sm leading-6 text-neutral-600 hover:text-neutral-900'
                                onClick={() => {
                                    setMode('signup');
                                    setAuthModalOpen(true);
                                }}
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <button
                            type='button'
                            className='cursor-pointer pb-6 text-sm leading-6 text-neutral-600 hover:text-neutral-900'
                            onClick={() => {
                                auth.signOut();
                                toast.success('Logged out!', {
                                    position: 'top-center',
                                });
                            }}
                        >
                            Sign Out
                        </button>
                    )}
                </nav>
                {/* <div className='mt-10 flex justify-center space-x-10'>
                        <a
                            href={item.href}
                            className='text-neutral-400 hover:text-neutral-500'
                        >
                            <span className='sr-only'>{item.name}</span>
                            <item.icon className='h-6 w-6' aria-hidden='true' />
                        </a>
                </div> */}
                <p className='mt-10 text-center text-xs leading-5 text-neutral-500'>
                    &copy; PageMoon, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
