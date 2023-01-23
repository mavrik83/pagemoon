/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { TbBookUpload } from 'react-icons/tb';
import { bookApi } from '../../utils/api';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { classNames } from '../../utils/helpers';
import { processImage } from '../../utils/helpers/base64';
import { useEditorStore } from '../editor/editor-store';
import { ComboSelectBox } from '../reusable/comboBoxSelect';
import { useBookStore } from './book-store';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Handlers {
    handleSubmit: SubmitHandler<FormInputs>;
    handleSearch: (searchTerm: string) => void;
}

interface FormInputs {
    title: string;
    authors: string;
    isbn: string;
    publisher: string;
    language: string;
    pages: number;
    readingAge: string;
    gradeLevel: string;
    cover: FileList;
}

const AddBook: FC<Props> = ({ open, setOpen }: Props) => {
    const selectedThemes = useBookStore(
        useCallback((state) => state.selectedThemes, []),
    );
    const resetBookState = useBookStore(
        useCallback((state) => state.resetBookState, []),
    );
    const fetchBooks = useEditorStore(
        useCallback((state) => state.fetchBooks, []),
    );

    const fetchThemes = useBookStore(
        useCallback((state) => state.fetchThemes, []),
    );

    const setSelectedThemes = useBookStore(
        useCallback((state) => state.setSelectedThemes, []),
    );
    const setIsbnData = useBookStore(
        useCallback((state) => state.setIsbnData, []),
    );
    const isbnData = useBookStore(useCallback((state) => state.isbnData, []));
    const options = useBookStore(useCallback((state) => state.options, []));

    const themeStatus = useBookStore(
        useCallback((state) => state.themeStatus, []),
    );
    const createTheme = useBookStore(
        useCallback((state) => state.createTheme, []),
    );

    const [hasResults, setHasResults] = useState<boolean>(false);
    const [isbn, setIsbn] = useState<string>('');

    const { authUser } = useFirebaseAuth();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm<FormInputs>({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            title: '',
            authors: '',
            isbn: '',
            publisher: '',
            language: '',
            pages: undefined,
            readingAge: '',
            gradeLevel: '',
        },
    });

    const handlers: Handlers = {
        handleSubmit: async (data) => {
            try {
                const coverImage = (await processImage(data.cover).catch(() => {
                    toast.error('Error processing image');
                })) as string;

                const themeIds = selectedThemes.map((theme) => theme.id);
                const newBook = {
                    ...data,
                    ...isbnData,
                    themeIds,
                    coverImage,
                    userUid: authUser?.uid,
                };

                bookApi.createBook(newBook).then((res) => {
                    if (res.title === data.title) {
                        fetchBooks();
                    }
                    toast.success('Book added successfully');
                });
            } catch (error) {
                toast.error('Error adding book');
            } finally {
                setOpen(false);
            }
        },
        handleSearch: async (searchTerm: string) => {
            try {
                await bookApi
                    .searchIsbnDb(searchTerm)
                    .then((res) => setIsbnData(res))
                    .then(() => {
                        setHasResults(true);
                    });
            } catch (err) {
                toast.error('Error searching ISBN');
            }
        },
    };

    useEffect(() => {
        if (isbnData && hasResults) {
            setValue('title', isbnData.title as string);
            setValue('authors', isbnData.authors as string);
            setValue('isbn', isbnData.isbn as string);
            setValue('publisher', isbnData.publisher as string as string);
            setValue('language', isbnData.language as string);
            setValue('pages', isbnData.pages as number);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasResults]);

    useEffect(() => {
        if (!open) {
            reset();
            resetBookState();
            setHasResults(false);
            setIsbn('');
        }
        if (open) {
            fetchThemes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as='div' className='relative z-50' onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-200'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-neutral-800 bg-opacity-75 backdrop-blur-sm transition-opacity' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-hidden'>
                    <div className='absolute inset-0 overflow-hidden'>
                        <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                            <Transition.Child
                                as={Fragment}
                                enter='transform transition ease-in-out duration-200'
                                enterFrom='translate-x-full'
                                enterTo='translate-x-0'
                                leave='transform transition ease-in-out duration-200'
                                leaveFrom='translate-x-0'
                                leaveTo='translate-x-full'
                            >
                                <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                                    <div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl'>
                                        <div className='px-4 sm:px-6'>
                                            <div className='flex items-start justify-between'>
                                                <Dialog.Title className='text-2xl font-thin text-sky-900'>
                                                    Add a New Book
                                                </Dialog.Title>
                                                <div className='ml-3 flex h-7 items-center'>
                                                    <button
                                                        type='button'
                                                        className='rounded-md bg-white hover:text-neutral-900 focus:outline-none'
                                                        onClick={() =>
                                                            setOpen(false)
                                                        }
                                                    >
                                                        <XIcon
                                                            className='h-6 w-6'
                                                            aria-hidden='true'
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                                            {!hasResults && (
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handlers.handleSearch(
                                                            isbn,
                                                        );
                                                    }}
                                                    className='mt-6 w-full rounded-md bg-secondary bg-opacity-30 p-10'
                                                >
                                                    <div className='max-w-sm py-1'>
                                                        <label
                                                            htmlFor='isbn'
                                                            className='ml-3 block text-sm font-light'
                                                        >
                                                            ISBN
                                                        </label>
                                                        <input
                                                            value={isbn || ''}
                                                            onChange={(e) =>
                                                                setIsbn(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            id='isbn'
                                                            type='text'
                                                            className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                                            placeholder='Search by ISBN'
                                                        />
                                                    </div>
                                                    <div className='max-w-sm py-1'>
                                                        <button
                                                            type='submit'
                                                            className='group relative flex w-full justify-center rounded-md border border-transparent bg-tertiary px-4 py-2 text-sm font-medium text-white hover:bg-secondary hover:bg-opacity-70 focus:outline-none disabled:bg-neutral-500 disabled:text-neutral-800'
                                                        >
                                                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                                                <TbBookUpload
                                                                    className='h-5 w-5 text-secondary group-hover:text-primary'
                                                                    aria-hidden='true'
                                                                />
                                                            </span>
                                                            Search
                                                        </button>
                                                    </div>
                                                    <div className='mt-6 max-w-sm py-1'>
                                                        <label
                                                            htmlFor='isbn'
                                                            className='ml-3 block text-sm font-light'
                                                        >
                                                            Don&apos;t know the
                                                            ISBN?
                                                        </label>
                                                        <button
                                                            onClick={() => {
                                                                reset();
                                                                setHasResults(
                                                                    true,
                                                                );
                                                            }}
                                                            type='button'
                                                            className='group relative flex w-full justify-center rounded-md border border-transparent bg-tertiary px-4 py-2 text-sm font-medium text-white hover:bg-secondary hover:bg-opacity-70 focus:outline-none disabled:bg-neutral-500 disabled:text-neutral-800'
                                                        >
                                                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                                                <TbBookUpload
                                                                    className='h-5 w-5 text-secondary group-hover:text-primary'
                                                                    aria-hidden='true'
                                                                />
                                                            </span>
                                                            Fill in the details
                                                            manually
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                            {hasResults && (
                                                <form
                                                    className='mt-6 w-fit max-w-screen-md rounded-md bg-secondary bg-opacity-30 p-10'
                                                    onSubmit={handleSubmit(
                                                        handlers.handleSubmit,
                                                    )}
                                                >
                                                    <div className='max-w-sm py-1'>
                                                        <label
                                                            htmlFor='title'
                                                            className='ml-3 block text-sm font-light'
                                                        >
                                                            Title
                                                        </label>
                                                        <input
                                                            {...register(
                                                                'title',
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            'Title is required',
                                                                    },
                                                                    minLength: {
                                                                        value: 3,
                                                                        message:
                                                                            'Title must be at least 3 characters',
                                                                    },
                                                                    maxLength: {
                                                                        value: 80,
                                                                        message:
                                                                            'Title must be less than 80 characters',
                                                                    },
                                                                },
                                                            )}
                                                            id='title'
                                                            type='text'
                                                            className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                                            placeholder='Alice in Wonderland'
                                                        />
                                                        {errors.title && (
                                                            <p
                                                                className='ml-3 mt-0.5 text-xs font-light text-alert'
                                                                id='title-error'
                                                            >
                                                                {
                                                                    errors.title
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className='max-w-sm py-1'>
                                                        <label
                                                            htmlFor='author'
                                                            className='ml-3 block text-sm font-light'
                                                        >
                                                            Author
                                                        </label>
                                                        <input
                                                            {...register(
                                                                'authors',
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            'Author is required',
                                                                    },
                                                                    maxLength: {
                                                                        value: 80,
                                                                        message:
                                                                            'Author must be less than 80 characters',
                                                                    },
                                                                },
                                                            )}
                                                            id='author'
                                                            type='text'
                                                            className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                                            placeholder='Lewis Carroll'
                                                        />
                                                        {errors.authors && (
                                                            <p
                                                                className='ml-3 mt-0.5 text-xs font-light text-alert'
                                                                id='author-error'
                                                            >
                                                                {
                                                                    errors
                                                                        .authors
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className='max-w-sm py-1'>
                                                        <label
                                                            htmlFor='isbn'
                                                            className='ml-3 block text-sm font-light'
                                                        >
                                                            ISBN
                                                        </label>
                                                        <input
                                                            {...register(
                                                                'isbn',
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            'ISBN is required',
                                                                    },
                                                                    maxLength: {
                                                                        value: 17,
                                                                        message:
                                                                            'ISBN must be less than 17 characters',
                                                                    },
                                                                    pattern: {
                                                                        value: /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/,
                                                                        message:
                                                                            'Must be a valid ISBN-10 or ISBN-13',
                                                                    },
                                                                },
                                                            )}
                                                            id='isbn'
                                                            type='text'
                                                            className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                                            placeholder='0147509076 -or- 978-0147509079'
                                                        />
                                                        {errors.isbn && (
                                                            <p
                                                                className='ml-3 mt-0.5 text-xs font-light text-alert'
                                                                id='isbn-error'
                                                            >
                                                                {
                                                                    errors.isbn
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className='max-w-sm py-1'>
                                                        <label
                                                            htmlFor='publisher'
                                                            className='ml-3 block text-sm font-light'
                                                        >
                                                            Publisher
                                                        </label>
                                                        <input
                                                            {...register(
                                                                'publisher',
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            'Publisher is required',
                                                                    },
                                                                    maxLength: {
                                                                        value: 80,
                                                                        message:
                                                                            'Publisher must be less than 80 characters',
                                                                    },
                                                                },
                                                            )}
                                                            id='publisher'
                                                            type='text'
                                                            className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                                            placeholder='Penguin Classics'
                                                        />
                                                        {errors.publisher && (
                                                            <p
                                                                className='ml-3 mt-0.5 text-xs font-light text-alert'
                                                                id='publisher-error'
                                                            >
                                                                {
                                                                    errors
                                                                        .publisher
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className='flex max-w-sm flex-row gap-2 py-1'>
                                                        <div className='basis-1/2'>
                                                            <label
                                                                htmlFor='language'
                                                                className='ml-3 block text-sm font-light'
                                                            >
                                                                Language
                                                            </label>
                                                            <input
                                                                {...register(
                                                                    'language',
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: true,
                                                                                message:
                                                                                    'Language is required',
                                                                            },
                                                                        maxLength:
                                                                            {
                                                                                value: 80,
                                                                                message:
                                                                                    'Language must be less than 80 characters',
                                                                            },
                                                                    },
                                                                )}
                                                                id='language'
                                                                type='text'
                                                                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                                                placeholder='English'
                                                            />
                                                            {errors.language && (
                                                                <p
                                                                    className='ml-3 mt-0.5 text-xs font-light text-alert'
                                                                    id='language-error'
                                                                >
                                                                    {
                                                                        errors
                                                                            .language
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className='basis-1/2'>
                                                            <label
                                                                htmlFor='pages'
                                                                className='ml-3 block text-sm font-light'
                                                            >
                                                                Number of Pages
                                                            </label>
                                                            <input
                                                                {...register(
                                                                    'pages',
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: true,
                                                                                message:
                                                                                    'Number of pages is required',
                                                                            },
                                                                        valueAsNumber:
                                                                            true,
                                                                        pattern:
                                                                            {
                                                                                value: /^[0-9]*$/,
                                                                                message:
                                                                                    'Must be a number',
                                                                            },
                                                                    },
                                                                )}
                                                                id='pages'
                                                                type='number'
                                                                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                                                placeholder='268'
                                                            />
                                                            {errors.pages && (
                                                                <p
                                                                    className='ml-3 mt-0.5 text-xs font-light text-alert'
                                                                    id='pages-error'
                                                                >
                                                                    {
                                                                        errors
                                                                            .pages
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='flex max-w-sm flex-row gap-2 py-1'>
                                                        <div className='basis-1/2'>
                                                            <label
                                                                htmlFor='reading-age'
                                                                className='ml-3 block text-sm font-light'
                                                            >
                                                                Reading Age
                                                            </label>
                                                            <input
                                                                {...register(
                                                                    'readingAge',
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: true,
                                                                                message:
                                                                                    'Reading Age is required',
                                                                            },
                                                                        maxLength:
                                                                            {
                                                                                value: 80,
                                                                                message:
                                                                                    'Reading Age must be less than 80 characters',
                                                                            },
                                                                    },
                                                                )}
                                                                id='reading-age'
                                                                type='text'
                                                                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                                                placeholder='8'
                                                            />
                                                            {errors.readingAge && (
                                                                <p
                                                                    className='ml-3 mt-0.5 text-xs font-light text-alert'
                                                                    id='readingAge-error'
                                                                >
                                                                    {
                                                                        errors
                                                                            .readingAge
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className='basis-1/2'>
                                                            <label
                                                                htmlFor='grade-level'
                                                                className='ml-3 block text-sm font-light'
                                                            >
                                                                Grade Level
                                                            </label>
                                                            <input
                                                                {...register(
                                                                    'gradeLevel',
                                                                    {
                                                                        required:
                                                                            {
                                                                                value: true,
                                                                                message:
                                                                                    'Grade Level is required',
                                                                            },
                                                                        maxLength:
                                                                            {
                                                                                value: 80,
                                                                                message:
                                                                                    'Grade Level must be less than 80 characters',
                                                                            },
                                                                    },
                                                                )}
                                                                id='grade-level'
                                                                type='text'
                                                                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                                                placeholder='4'
                                                            />
                                                            {errors.gradeLevel && (
                                                                <p
                                                                    className='ml-3 mt-0.5 text-xs font-light text-alert'
                                                                    id='gradeLevel-error'
                                                                >
                                                                    {
                                                                        errors
                                                                            .gradeLevel
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={classNames(
                                                            selectedThemes.length ===
                                                                0
                                                                ? 'hidden'
                                                                : '',
                                                            'my-2 flex flex-row flex-wrap gap-1',
                                                        )}
                                                    >
                                                        {selectedThemes.map(
                                                            (theme) => (
                                                                <span
                                                                    key={
                                                                        theme.name
                                                                    }
                                                                    className='inline-flex items-center rounded-full bg-secondary bg-opacity-30 px-2 py-[0.1rem] text-xs font-light'
                                                                >
                                                                    {theme.name}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                    <div className='flex max-w-sm flex-row gap-2 py-1'>
                                                        <div className='basis-1/2'>
                                                            <label
                                                                htmlFor='grade-level'
                                                                className={classNames(
                                                                    selectedThemes.length >
                                                                        0
                                                                        ? 'hidden'
                                                                        : '',
                                                                    'ml-3 block text-sm font-light',
                                                                )}
                                                            >
                                                                Themes
                                                            </label>
                                                            <ComboSelectBox
                                                                selectedOptions={
                                                                    selectedThemes
                                                                }
                                                                loadingStatus={
                                                                    themeStatus
                                                                }
                                                                options={
                                                                    options
                                                                }
                                                                setSelectedOptions={
                                                                    setSelectedThemes as any
                                                                }
                                                                theme='primary'
                                                                label='Themes'
                                                                creatable
                                                                createCallback={
                                                                    createTheme
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='w-full py-1'>
                                                        <label
                                                            htmlFor='upload-cover'
                                                            className='ml-3 block text-sm font-light'
                                                        >
                                                            Upload Cover
                                                        </label>
                                                        <input
                                                            {...register(
                                                                'cover',
                                                                {
                                                                    required: {
                                                                        value: true,
                                                                        message:
                                                                            'Cover image is required',
                                                                    },
                                                                },
                                                            )}
                                                            id='upload-cover'
                                                            type='file'
                                                            className='inline-flex w-full appearance-none items-center justify-center whitespace-nowrap rounded-md border border-primary bg-tertiary text-sm font-medium file:rounded-md file:border-none file:bg-primary file:px-3 file:py-2 file:shadow-lg file:hover:scale-105 file:active:scale-100 file:active:shadow-none'
                                                        />
                                                        {errors.cover && (
                                                            <p
                                                                className='ml-3 mt-0.5 text-xs font-light text-alert'
                                                                id='cover-error'
                                                            >
                                                                {
                                                                    errors.cover
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className='mt-5'>
                                                        <button
                                                            disabled={!isValid}
                                                            type='submit'
                                                            className='group relative flex w-full justify-center rounded-md border border-transparent bg-tertiary px-4 py-2 text-sm font-medium text-white hover:bg-secondary hover:bg-opacity-70 focus:outline-none disabled:bg-neutral-500 disabled:text-neutral-800'
                                                        >
                                                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                                                <TbBookUpload
                                                                    className='h-5 w-5 text-secondary group-hover:text-primary'
                                                                    aria-hidden='true'
                                                                />
                                                            </span>
                                                            Add Book
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
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

export default AddBook;
