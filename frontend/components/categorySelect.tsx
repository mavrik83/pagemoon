import React, { FC, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { TbCheck, TbDirection } from 'react-icons/tb';
import { useEditorStore } from './tiptap/editor-store';

export const CategorySelect: FC = () => {
    const selectedCategories = useEditorStore(
        (state) => state.selectedCategories,
    );
    const setSelectedCategories = useEditorStore(
        (state) => state.setSelectedCategories,
    );
    const options = useEditorStore((state) => state.options);

    const categoryStatus = useEditorStore((state) => state.categoryStatus);

    return (
        <div className="z-30">
            <Listbox
                value={selectedCategories}
                onChange={setSelectedCategories}
                multiple
            >
                <div className="relative">
                    <Listbox.Button className="inline-flex items-center justify-center whitespace-nowrap font-medium rounded-lg shadow-lg hover:scale-105 active:shadow-none active:scale-100 text-black bg-secondary bg-opacity-20 border border-secondary text-sm py-2 px-2">
                        <span>
                            {categoryStatus === 'done'
                                ? 'Category Select'
                                : 'Loading...'}
                        </span>
                        <span className="bg-tertiary bg-opacity-30 ml-2 rounded-xl">
                            <TbDirection
                                className="h-6 w-auto text-black"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                            {categoryStatus === 'done' &&
                                options &&
                                options.map((category) => (
                                    <Listbox.Option
                                        key={category.name}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? 'bg-tertiary bg-opacity-30 text-black'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                        value={category}
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
                                                    {category.name}
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                                                        <TbCheck
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
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
