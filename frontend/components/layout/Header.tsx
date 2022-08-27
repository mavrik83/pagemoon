import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { MoonIcon, MenuIcon } from '@heroicons/react/solid';
import React, {
    ComponentPropsWithRef,
    forwardRef,
    Fragment,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import { Auth, AuthProps } from '../auth';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { Button } from '..';

interface MenuProps {
    // eslint-disable-next-line react/no-unused-prop-types
    active: boolean;
}

const navigation = [{ name: 'Editor', href: '/editor' }];

export const MyLink = forwardRef((props: ComponentPropsWithRef<any>, ref) => {
    const { href, children, ...rest } = props;
    return (
        <Link href={href}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <a ref={ref} {...rest}>
                {children}
            </a>
        </Link>
    );
});

MyLink.displayName = 'myLink';

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

export const Header: React.FC = () => {
    const [open, setOpen] = useState(false);

    const [mode, setMode] = useState<AuthProps['mode']>('signin');

    const { authUser, auth, authLoading } = useFirebaseAuth();

    return (
        <>
            <Auth open={open} setOpen={setOpen} mode={mode} />
            <header className="sticky top-0 z-40 font-light shadow-xl backdrop-blur-sm">
                <nav
                    className="px-4 pb-2 mx-auto max-w-7xl sm:px-6 lg:px-8 backdrop-blur-sm"
                    aria-label="Top"
                >
                    <div className="flex items-center justify-between w-full py-2">
                        <div className="flex items-center">
                            <MyLink href="/">
                                <MoonIcon className="w-auto lg:duration-300 lg:ease-in-out lg:transition-colors text-primary h-14 lg:hover:text-secondary lg:hover:text-opacity-90" />
                            </MyLink>
                            <div className="hidden text-3xl sm:block text-primary">
                                PageMoon
                            </div>
                            <div className="hidden ml-10 space-x-8 sm:block">
                                {navigation.map((link) => (
                                    <MyLink
                                        key={link.name}
                                        href={link.href}
                                        className="text-lg transition-colors duration-300 ease-in-out text-secondary hover:text-tertiary "
                                    >
                                        {link.name}
                                    </MyLink>
                                ))}
                            </div>
                        </div>
                        {!authLoading ? (
                            <div>
                                {authUser ? (
                                    <div className="flex-shrink-0 hidden group sm:block">
                                        <div className="flex items-center">
                                            <div className="inline-block w-10 h-10 overflow-hidden rounded-full bg-sky-100">
                                                <MyLink
                                                    href={`user/${authUser.uid}`}
                                                >
                                                    <svg
                                                        className="w-full h-full text-sky-900"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </MyLink>
                                            </div>
                                            <div className="ml-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        auth
                                                            .signOut()
                                                            .then(() => {
                                                                toast.success(
                                                                    'Logged out!',
                                                                    {
                                                                        position:
                                                                            'top-center',
                                                                    },
                                                                );
                                                            })
                                                    }
                                                >
                                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm bg-sky-100 text-sky-900">
                                                        Sign Out
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="hidden ml-10 space-x-4 sm:block">
                                        <Button
                                            onClick={() => {
                                                setMode('signin');
                                                setOpen(true);
                                            }}
                                        >
                                            Sign in
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setMode('signup');
                                                setOpen(true);
                                            }}
                                        >
                                            Sign up
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-10 h-10 border-l-2 rounded-full border-highlight animate-spin" />
                        )}
                        <Menu
                            as="div"
                            className="relative inline-block text-left sm:hidden"
                        >
                            <div>
                                <Menu.Button className="flex items-center text-secondary focus:outline-none ">
                                    <MenuIcon
                                        className="w-auto h-8"
                                        aria-hidden="true"
                                    />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-highlight focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }: MenuProps) => (
                                                <MyLink
                                                    href="/editor"
                                                    className={classNames(
                                                        active
                                                            ? 'bg-gray-100 text-secondary'
                                                            : 'text-primary',
                                                        'block px-4 py-2 text-sm',
                                                    )}
                                                >
                                                    Editor
                                                </MyLink>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="py-1">
                                        {!authLoading ? (
                                            <div>
                                                {!authUser ? (
                                                    <>
                                                        <Menu.Item>
                                                            {({
                                                                active,
                                                            }: MenuProps) => (
                                                                <button
                                                                    onClick={() => {
                                                                        setMode(
                                                                            'signin',
                                                                        );
                                                                        setOpen(
                                                                            true,
                                                                        );
                                                                    }}
                                                                    type="button"
                                                                    className={classNames(
                                                                        active
                                                                            ? 'bg-gray-100 text-sky-700'
                                                                            : 'text-sky-900',
                                                                        'block px-4 py-2 text-sm',
                                                                    )}
                                                                >
                                                                    Sign In
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({
                                                                active,
                                                            }: MenuProps) => (
                                                                <button
                                                                    onClick={() => {
                                                                        setMode(
                                                                            'signup',
                                                                        );
                                                                        setOpen(
                                                                            true,
                                                                        );
                                                                    }}
                                                                    type="button"
                                                                    className={classNames(
                                                                        active
                                                                            ? 'bg-gray-100 text-sky-700'
                                                                            : 'text-sky-900',
                                                                        'block px-4 py-2 text-sm',
                                                                    )}
                                                                >
                                                                    Sign Up
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </>
                                                ) : (
                                                    <Menu.Item>
                                                        {({
                                                            active,
                                                        }: MenuProps) => (
                                                            <button
                                                                onClick={() =>
                                                                    auth.signOut()
                                                                }
                                                                type="button"
                                                                className={classNames(
                                                                    active
                                                                        ? 'bg-gray-100 text-sky-700'
                                                                        : 'text-sky-900',
                                                                    'block px-4 py-2 text-sm',
                                                                )}
                                                            >
                                                                Sign Out
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </nav>
            </header>
        </>
    );
};
