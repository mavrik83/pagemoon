/* eslint-disable react/require-default-props */
import React, { FC, Fragment, useState } from 'react';
import { Transition, Combobox } from '@headlessui/react';
import { TbCheck, TbDirection } from 'react-icons/tb';
import { classNames } from '../../utils/helpers';
import { FUser, useFirebaseAuth } from '../../utils/contexts/firebaseProvider';

export interface ListOption {
    id: string;
    name: string;
}
interface Props {
    selectedOptions: ListOption[] | ListOption;
    setSelectedOptions: (selectedOptions: ListOption[] | ListOption) => void;
    options: ListOption[];
    loadingStatus: 'done' | 'loading' | 'error' | 'idle';
    theme: 'primary' | 'secondary' | 'tertiary';
    label: string;
    isMulti?: boolean;
    creatable?: boolean;
    createCallback?: (value: string, authUser: FUser) => void;
}

export const ComboSelectBox: FC<Props> = ({
    selectedOptions,
    setSelectedOptions,
    options,
    loadingStatus,
    theme,
    label,
    createCallback,
    isMulti = true,
    creatable = false,
}) => {
    const [query, setQuery] = useState('');

    const { authUser } = useFirebaseAuth();

    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) =>
                  option.name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, '')),
              );

    const determineLabel = (
        selected: ListOption[] | ListOption,
        labelProp: string,
    ) => {
        if (isMulti) {
            if ((selected as ListOption[])?.length > 0) {
                return `${labelProp} *`;
            }
            return labelProp;
        }
        if ((selected as ListOption)?.name) {
            return `${labelProp} *`;
        }
        return labelProp;
    };

    return (
        <div className='z-30'>
            <Combobox
                value={selectedOptions}
                onChange={setSelectedOptions}
                multiple={isMulti}
                nullable
            >
                <div className='relative'>
                    <Combobox.Input
                        className={classNames(
                            theme === 'secondary'
                                ? 'rounded-lg border-secondary bg-secondary bg-opacity-20 py-2'
                                : 'rounded-md border-primary bg-tertiary py-2',
                            'inline-flex w-fit items-center justify-center whitespace-nowrap border px-2 text-sm font-medium shadow-lg outline-none placeholder:text-neutral-800 hover:scale-105 focus:scale-105 focus:placeholder:text-neutral-300 active:scale-100 active:shadow-none',
                        )}
                        placeholder={determineLabel(selectedOptions, label)}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
                        <span className='ml-2'>
                            <TbDirection
                                className='h-auto w-6'
                                aria-hidden='true'
                            />
                        </span>
                    </Combobox.Button>
                    <Transition
                        as={Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <Combobox.Options className='absolute z-50 mt-1 max-h-60 max-w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:z-40 focus:outline-none active:z-40 sm:text-sm'>
                            {creatable &&
                                query.length >= 3 &&
                                !options.some((option) =>
                                    option.name
                                        .toLowerCase()
                                        .replace(/\s+/g, '')
                                        .includes(
                                            query
                                                .toLowerCase()
                                                .replace(/\s+/g, ''),
                                        ),
                                ) && (
                                    <button
                                        type='button'
                                        onClick={() => {
                                            if (createCallback) {
                                                createCallback(query, authUser);
                                                setQuery('');
                                            }
                                        }}
                                        className='relative w-full cursor-pointer bg-secondary bg-opacity-30 py-2 pl-10 pr-4'
                                    >
                                        Create: {query}
                                    </button>
                                )}
                            {loadingStatus === 'done' &&
                                options &&
                                filteredOptions.map((option) => (
                                    <Combobox.Option
                                        key={option.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? 'bg-tertiary bg-opacity-30'
                                                    : 'text-neutral-600'
                                            }`
                                        }
                                        value={option}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}
                                                >
                                                    {option.name}
                                                </span>
                                                {selected ? (
                                                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-secondary'>
                                                        <TbCheck
                                                            className='h-5 w-5'
                                                            aria-hidden='true'
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    );
};
