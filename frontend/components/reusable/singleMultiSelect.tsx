/* eslint-disable react/require-default-props */
import React, { FC, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { TbCheck, TbDirection } from 'react-icons/tb';
import { classNames } from '../../utils/helpers';

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
}

export const SingleMultiSelect: FC<Props> = ({
    selectedOptions,
    setSelectedOptions,
    options,
    loadingStatus,
    theme,
    label,
    isMulti = true,
}) => {
    const determineLabel = (
        selected: ListOption[] | ListOption,
        labelProp: string,
    ) => {
        if (isMulti) {
            return labelProp;
        }
        if (!(selected as ListOption).name) {
            return labelProp;
        }
        return (selected as ListOption).name;
    };

    return (
        <div className='z-30'>
            <Listbox
                value={selectedOptions}
                onChange={setSelectedOptions}
                multiple={isMulti}
            >
                <div className='relative'>
                    <Listbox.Button
                        className={classNames(
                            theme === 'secondary'
                                ? 'rounded-lg border-secondary bg-secondary bg-opacity-20 py-2'
                                : 'rounded-md border-primary bg-tertiary py-1',
                            'inline-flex max-w-fit items-center justify-center whitespace-nowrap border px-2 text-sm font-medium shadow-lg hover:scale-105 active:scale-100 active:shadow-none',
                        )}
                    >
                        <span>
                            {loadingStatus === 'done'
                                ? determineLabel(selectedOptions, label)
                                : 'Loading...'}
                        </span>
                        <span className='ml-2'>
                            <TbDirection
                                className='h-6 w-auto'
                                aria-hidden='true'
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <Listbox.Options className='absolute z-50 mt-1 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                            {loadingStatus === 'done' &&
                                options &&
                                options.map((option) => (
                                    <Listbox.Option
                                        key={option.name}
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
                                    </Listbox.Option>
                                ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};
