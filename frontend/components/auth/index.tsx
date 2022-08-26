/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LockClosedIcon, XIcon } from '@heroicons/react/outline';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { userApi } from '../../utils/api';

export interface AuthProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    mode: 'signin' | 'signup';
}

export const Auth: React.FC<AuthProps> = ({ open, setOpen, mode }) => {
    const { auth } = useFirebaseAuth();

    const [authForm, setAuthForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

    const handlers = {
        handleChange: (e: any) => {
            setAuthForm({ ...authForm, [e.target.name]: e.target.value });
        },
        handleSubmit: (e: any) => {
            e.preventDefault();

            if (mode === 'signin') {
                signInWithEmailAndPassword(
                    auth,
                    authForm.email,
                    authForm.password,
                )
                    .then((userCred) => {
                        toast.success(`Signed in as: ${userCred.user.email}`, {
                            position: 'top-center',
                        });
                        setOpen(false);
                    })
                    .catch((err) => {
                        toast.error(`${err.message}`, {
                            position: 'top-center',
                        });
                    });
            }

            if (mode === 'signup') {
                createUserWithEmailAndPassword(
                    auth,
                    authForm.email,
                    authForm.password,
                )
                    .then((userCred) => {
                        userApi
                            .createUser({
                                authUid: userCred.user.uid,
                                email: userCred.user.email,
                                password: authForm.password,
                                firstName: authForm.firstName,
                                lastName: authForm.lastName,
                            })
                            .then((user) => {
                                toast.success(`Saved new user: ${user.email}`, {
                                    position: 'top-center',
                                });
                                setOpen(false);
                            });
                    })
                    .catch((err) => {
                        toast.error(`${err.message}`, {
                            position: 'top-center',
                        });
                    });
            }
        },
        handleLogout: () => {
            auth.signOut();
            toast.success('Logged out!', { position: 'top-center' });
        },
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-200"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-200"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="w-screen max-w-md pointer-events-auto">
                                    <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-2xl font-thin text-sky-900">
                                                    {mode === 'signin'
                                                        ? 'Sign In'
                                                        : 'Sign Up'}
                                                </Dialog.Title>
                                                <div className="flex items-center ml-3 h-7">
                                                    <button
                                                        type="button"
                                                        className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none"
                                                        onClick={() =>
                                                            setOpen(false)
                                                        }
                                                    >
                                                        <XIcon
                                                            className="w-6 h-6"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative flex-1 px-4 mt-6 sm:px-6">
                                            <form
                                                className="mt-8 space-y-6"
                                                onSubmit={(e) =>
                                                    handlers.handleSubmit(e)
                                                }
                                            >
                                                <input
                                                    type="hidden"
                                                    name="remember"
                                                    defaultValue="true"
                                                />
                                                {mode === 'signup' && (
                                                    <div className="-space-y-px rounded-md shadow-sm">
                                                        <div>
                                                            <label
                                                                htmlFor="first-name"
                                                                className="sr-only"
                                                            >
                                                                First Name
                                                            </label>
                                                            <input
                                                                value={
                                                                    authForm.firstName ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    handlers.handleChange(
                                                                        e,
                                                                    )
                                                                }
                                                                id="first-name"
                                                                name="firstName"
                                                                type="text"
                                                                required
                                                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-tertiary focus:border-tertiary focus:z-10 sm:text-sm"
                                                                placeholder="First Name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="last-name"
                                                                className="sr-only"
                                                            >
                                                                Last Name
                                                            </label>
                                                            <input
                                                                value={
                                                                    authForm.lastName ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    handlers.handleChange(
                                                                        e,
                                                                    )
                                                                }
                                                                id="last-name"
                                                                name="lastName"
                                                                type="text"
                                                                required
                                                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-highlight focus:border-highlight focus:z-10 sm:text-sm"
                                                                placeholder="Last Name"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="-space-y-px rounded-md shadow-sm">
                                                    <div>
                                                        <label
                                                            htmlFor="email-address"
                                                            className="sr-only"
                                                        >
                                                            Email address
                                                        </label>
                                                        <input
                                                            value={
                                                                authForm.email ||
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                handlers.handleChange(
                                                                    e,
                                                                )
                                                            }
                                                            id="email-address"
                                                            name="email"
                                                            type="email"
                                                            autoComplete="email"
                                                            required
                                                            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-tertiary focus:border-tertiary focus:z-10 sm:text-sm"
                                                            placeholder="Email address"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="password"
                                                            className="sr-only"
                                                        >
                                                            Password
                                                        </label>
                                                        <input
                                                            value={
                                                                authForm.password ||
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                handlers.handleChange(
                                                                    e,
                                                                )
                                                            }
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            autoComplete="current-password"
                                                            required
                                                            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-highlight focus:border-highlight focus:z-10 sm:text-sm"
                                                            placeholder="Password"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <input
                                                            id="remember-me"
                                                            name="remember-me"
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-secondary text-primary"
                                                        />
                                                        <label
                                                            htmlFor="remember-me"
                                                            className="block ml-2 text-sm text-primary"
                                                        >
                                                            Remember Me
                                                        </label>
                                                    </div>
                                                    {mode === 'signin' && (
                                                        <div className="text-sm">
                                                            <a
                                                                href="/forgot-password"
                                                                className="font-medium text-primary hover:text-opacity-70"
                                                            >
                                                                Forgot your
                                                                password?
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-tertiary hover:bg-secondary hover:bg-opacity-70 focus:outline-none"
                                                    >
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <LockClosedIcon
                                                                className="w-5 h-5 text-secondary group-hover:text-primary"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                        {mode === 'signin'
                                                            ? 'Sign In'
                                                            : 'Sign Up'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
