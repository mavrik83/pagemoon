import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/solid';
import { WiMoonAltWaxingCrescent3 } from 'react-icons/wi';
import { SiAboutdotme } from 'react-icons/si';
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

const navigation = [
    { name: 'Create Article', href: '/editor', adminOnly: true },
    { name: 'All Reviews', href: '/posts', adminOnly: false },
];

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
            <header className='sticky top-0 z-40 bg-white bg-opacity-50 font-light shadow-xl backdrop-blur-sm'>
                <nav
                    className='mx-auto max-w-7xl px-4 pb-2 backdrop-blur-sm sm:px-6 lg:px-8'
                    aria-label='Top'
                >
                    <div className='flex w-full items-center justify-between py-2'>
                        <div className='flex items-center'>
                            <MyLink href='/'>
                                <WiMoonAltWaxingCrescent3 className='h-14 w-auto rotate-45 text-primary lg:transition-colors lg:duration-300 lg:ease-in-out lg:hover:text-secondary lg:hover:text-opacity-90' />
                            </MyLink>
                            <MyLink href='/'>
                                <div className='hidden text-3xl text-primary sm:block'>
                                    PageMoon
                                </div>
                            </MyLink>
                            <div className='ml-10 hidden space-x-8 sm:block'>
                                {navigation.map((link) => (
                                    <MyLink
                                        key={link.name}
                                        href={link.href}
                                        className={classNames(
                                            link.adminOnly ? 'hidden' : '',
                                            'text-lg text-secondary transition-colors duration-300 ease-in-out hover:text-tertiary',
                                        )}
                                    >
                                        {link.name}
                                    </MyLink>
                                ))}
                            </div>
                        </div>
                        {!authLoading ? (
                            <div>
                                {authUser ? (
                                    <div className='group hidden flex-shrink-0 sm:block'>
                                        <div className='flex items-center'>
                                            <div className='inline-block h-10 w-10 overflow-hidden rounded'>
                                                <MyLink
                                                    href={`user/${authUser.uid}`}
                                                >
                                                    <SiAboutdotme className='h-10 w-auto text-primary' />
                                                </MyLink>
                                            </div>
                                            <div className='ml-3'>
                                                <button
                                                    type='button'
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
                                                    <span className='inline-flex items-center rounded-full bg-tertiary bg-opacity-30 px-3 py-0.5 text-sm text-black'>
                                                        Sign Out
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='ml-10 hidden space-x-4 sm:block'>
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
                            <div className='h-10 w-10 animate-spin rounded-full border-l-2 border-highlight' />
                        )}
                        <Menu
                            as='div'
                            className='relative inline-block text-left sm:hidden'
                        >
                            <div>
                                <Menu.Button className='flex items-center text-secondary focus:outline-none '>
                                    <MenuIcon
                                        className='h-8 w-auto'
                                        aria-hidden='true'
                                    />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter='transition ease-out duration-100'
                                enterFrom='transform opacity-0 scale-95'
                                enterTo='transform opacity-100 scale-100'
                                leave='transition ease-in duration-75'
                                leaveFrom='transform opacity-100 scale-100'
                                leaveTo='transform opacity-0 scale-95'
                            >
                                <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-highlight rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                    <div className='py-1'>
                                        {navigation.map((link) => (
                                            <Menu.Item key={link.name}>
                                                {({ active }: MenuProps) => (
                                                    <MyLink
                                                        href={link.href}
                                                        className={classNames(
                                                            link.adminOnly
                                                                ? 'hidden'
                                                                : '',
                                                            active
                                                                ? 'bg-gray-100 text-secondary'
                                                                : 'text-primary',
                                                            'block px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        {link.name}
                                                    </MyLink>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                    <div className='py-1'>
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
                                                                    type='button'
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
                                                                    type='button'
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
                                                                type='button'
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
