import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { OnChangeValue } from 'react-select';

interface ComboboxProps {
    options: IOption[];
    changeHandler: (value: OnChangeValue<IOption, true>) => void;
    createHandler: (inputValue: string) => void;
}

export interface IOption {
    value: string;
    label: string;
}

export const ComboBox: React.FC<ComboboxProps> = ({
    options,
    changeHandler,
    createHandler,
}) => (
    <CreatableSelect
        className="react-select-container"
        classNamePrefix="rstw"
        isMulti
        onCreateOption={createHandler}
        onChange={changeHandler}
        options={options}
    />

    // <Combobox value={selectedItems} onChange={setSelectedItems} multiple>
    //     <div className="relative z-30">
    //         <div className="relative w-full overflow-hidden text-left bg-white border rounded-lg shadow-md cursor-default focus:outline-none border-secondary ">
    //             <Combobox.Input
    //                 className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-opacity-25 border-none focus:ring-0 bg-secondary"
    //                 // eslint-disable-next-line @typescript-eslint/no-shadow
    //                 placeholder="Categories"
    //                 onChange={(event) => setQuery(event.target.value)}
    //             />
    //             <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
    //                 <SelectorIcon
    //                     className="w-5 h-5 text-gray-400"
    //                     aria-hidden="true"
    //                 />
    //             </Combobox.Button>
    //         </div>
    //         <Transition
    //             as={Fragment}
    //             leave="transition ease-in duration-100"
    //             leaveFrom="opacity-100"
    //             leaveTo="opacity-0"
    //             afterLeave={() => setQuery('')}
    //         >
    //             <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
    //                 {filteredItems.length === 0 && query !== '' ? (
    //                     <Combobox.Option
    //                         className={({ active }) =>
    //                             `relative cursor-default select-none py-2 pl-10 pr-4 ${
    //                                 active
    //                                     ? 'bg-tertiary text-white'
    //                                     : 'text-gray-900'
    //                             }`
    //                         }
    //                         value={{
    //                             id: `::${Math.random()}`,
    //                             name: query,
    //                         }}
    //                     >
    //                         {({ selected, active }) => (
    //                             <>
    //                                 <span
    //                                     className={`block truncate ${
    //                                         selected
    //                                             ? 'font-medium'
    //                                             : 'font-normal'
    //                                     }`}
    //                                 >
    //                                     {`Add: ${query}`}
    //                                 </span>
    //                                 {selected ? (
    //                                     <span
    //                                         className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
    //                                             active
    //                                                 ? 'text-white'
    //                                                 : 'text-primary'
    //                                         }`}
    //                                     >
    //                                         <CheckIcon
    //                                             className="w-5 h-5"
    //                                             aria-hidden="true"
    //                                         />
    //                                     </span>
    //                                 ) : null}
    //                             </>
    //                         )}
    //                     </Combobox.Option>
    //                 ) : (
    //                     filteredItems.map((item) => (
    //                         <Combobox.Option
    //                             key={item.id}
    //                             className={({ active }) =>
    //                                 `relative cursor-default select-none py-2 pl-10 pr-4 ${
    //                                     active
    //                                         ? 'bg-tertiary text-white'
    //                                         : 'text-gray-900'
    //                                 }`
    //                             }
    //                             value={item}
    //                         >
    //                             {({ selected, active }) => (
    //                                 <>
    //                                     <span
    //                                         className={`block truncate ${
    //                                             selected
    //                                                 ? 'font-medium'
    //                                                 : 'font-normal'
    //                                         }`}
    //                                     >
    //                                         {item.id?.includes('::')
    //                                             ? `*${item.name}`
    //                                             : item.name}
    //                                     </span>
    //                                     {selected ? (
    //                                         <span
    //                                             className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
    //                                                 active
    //                                                     ? 'text-white'
    //                                                     : 'text-primary'
    //                                             }`}
    //                                         >
    //                                             <CheckIcon
    //                                                 className="w-5 h-5"
    //                                                 aria-hidden="true"
    //                                             />
    //                                         </span>
    //                                     ) : null}
    //                                 </>
    //                             )}
    //                         </Combobox.Option>
    //                     ))
    //                 )}
    //             </Combobox.Options>
    //         </Transition>
    //     </div>
    // </Combobox>
);
