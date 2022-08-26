import React, { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import Button from './button';

interface ListItem {
    name: string;
    id: string;
}

const items: ListItem[] = [
    { id: '1', name: 'Wade Cooper' },
    { id: '2', name: 'Arlene Mccoy' },
    { id: '3', name: 'Devon Webb' },
    { id: '4', name: 'Tom Cook' },
    { id: '5', name: 'Tanya Fox' },
    { id: '6', name: 'Hellen Schmidt' },
];

export const ComboBox: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<ListItem>();
    const [query, setQuery] = useState('');

    const filteredItems =
        query === ''
            ? items
            : items.filter((item) =>
                  item.name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, '')),
              );

    return (
        <Combobox value={selectedItem} onChange={setSelectedItem}>
            <div className="relative z-30">
                <div className="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none outline outline-secondary ">
                    <Combobox.Input
                        className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-opacity-25 border-none focus:ring-0 bg-secondary"
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        displayValue={(item: ListItem) =>
                            item ? item.name : 'Categories...'
                        }
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <SelectorIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <Button
                            secondary
                            twClasses="relative mt-1 mx-2 w-fit bg-tertiary !outline-tertiary"
                        >
                            Add Selected
                        </Button>
                        {filteredItems.length === 0 && query !== '' ? (
                            <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                                Nothing found.
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <Combobox.Option
                                    key={item.id}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active
                                                ? 'bg-tertiary bg-opacity-50 text-white'
                                                : 'text-gray-900'
                                        }`
                                    }
                                    value={item}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected
                                                        ? 'font-medium'
                                                        : 'font-normal'
                                                }`}
                                            >
                                                {item.name}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active
                                                            ? 'text-white'
                                                            : 'text-teal-600'
                                                    }`}
                                                >
                                                    <CheckIcon
                                                        className="w-5 h-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
};
