import React, { FC } from 'react';
import toast from 'react-hot-toast';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { AuthProps } from '../auth';
import { MyLink } from '../reusable';

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
                    className='-mb-6 flex columns-2 flex-wrap justify-center space-x-5 sm:space-x-12'
                    aria-label='Footer'
                >
                    <MyLink href='/' className='pb-6'>
                        <div className='cursor-pointer text-sm leading-6 text-neutral-600 hover:text-neutral-900'>
                            Home
                        </div>
                    </MyLink>
                    <MyLink href='/books' className='pb-6'>
                        <div className='cursor-pointer text-sm leading-6 text-neutral-600 hover:text-neutral-900'>
                            All Books
                        </div>
                    </MyLink>
                    {authUser && (
                        <>
                            <MyLink href='/editor' className='pb-6'>
                                <div className='cursor-pointer text-sm leading-6 text-neutral-600 hover:text-neutral-900'>
                                    Create Review
                                </div>
                            </MyLink>
                            <MyLink
                                href='/editor?type=article'
                                className='pb-6'
                            >
                                <div className='cursor-pointer text-sm leading-6 text-neutral-600 hover:text-neutral-900'>
                                    Create Article
                                </div>
                            </MyLink>
                        </>
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
                                toast.success('Logged out!');
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
