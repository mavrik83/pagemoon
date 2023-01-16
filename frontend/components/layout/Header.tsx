import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/solid';
import { WiMoonAltWaxingCrescent3 } from 'react-icons/wi';
import React, { ComponentPropsWithRef, forwardRef, Fragment } from 'react';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';

interface MenuProps {
    // eslint-disable-next-line react/no-unused-prop-types
    active: boolean;
}

interface Props {
    // eslint-disable-next-line react/no-unused-prop-types
    authModalOpen: boolean;
    setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const navigation = [
    { name: 'Create Review', href: '/editor', adminOnly: true },
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

export const Header: React.FC<Props> = () => {
    const { authUser } = useFirebaseAuth();

    return (
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
                            {navigation
                                .filter((link) =>
                                    authUser ? true : !link.adminOnly,
                                )
                                .map((link) => (
                                    <MyLink
                                        key={link.name}
                                        href={link.href}
                                        className='text-lg text-secondary transition-colors duration-300 ease-in-out hover:text-tertiary'
                                    >
                                        {link.name}
                                    </MyLink>
                                ))}
                        </div>
                    </div>
                    <div className='ml-10 hidden space-x-8 text-lg text-tertiary sm:block'>
                        Hi, {authUser?.email}
                    </div>
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
                                    {navigation
                                        .filter((link) =>
                                            authUser ? true : !link.adminOnly,
                                        )
                                        .map((link) => (
                                            <Menu.Item key={link.name}>
                                                {({ active }: MenuProps) => (
                                                    <MyLink
                                                        href={link.href}
                                                        className={classNames(
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
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </nav>
        </header>
    );
};
