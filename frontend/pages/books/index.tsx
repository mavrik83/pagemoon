/* eslint-disable jsx-a11y/label-has-associated-control */
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

const Books: NextPage = () => {
    const router = useRouter();

    return (
        <>
            <div className='mt-5 rounded-md bg-secondary bg-opacity-30'>
                <div className='mx-auto max-w-7xl py-8 px-6 lg:flex lg:justify-between lg:px-8'>
                    <div className='max-w-xl'>
                        <h2 className='text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl'>
                            All Books
                        </h2>
                        <p className='mt-5 text-xl'>
                            Click on any tag or theme to filter.
                        </p>
                        {router.query.tag && (
                            <div className='mt-5 block text-sm font-light'>
                                <p>
                                    Sorting by:{' '}
                                    {(router.query.tag as string).toUpperCase()}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='mt-10 w-full max-w-xs'>
                        <label
                            htmlFor='search'
                            className='ml-3 block text-sm font-light'
                        >
                            Search for Anything
                        </label>
                        <div className='relative mt-1.5'>
                            <input
                                disabled
                                id='search'
                                type='text'
                                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                placeholder='Coming Soon... maybe'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='mx-5 mt-5 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-2'>
                <div className='col-span-1 border border-primary'>
                    <div className='grid grid-cols-5 gap-2'>
                        <div className='col-span-3 my-2 ml-2 h-20 border border-primary' />
                        <div className='col-span-2 my-2 mr-2 h-20 border border-primary' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Books;
