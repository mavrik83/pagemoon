import React, { useCallback } from 'react';
import CreatableSelect from 'react-select/creatable';
import { StylesConfig } from 'react-select';
import { useEditorStore } from './tiptap/editor-store';
import { useFirebaseAuth } from '../utils/contexts/firebaseProvider';

export interface IOption {
    value: string;
    label: string;
}

const customStyles: StylesConfig<IOption, true> = {
    container: (provided: any) => ({
        ...provided,
        position: 'relative',
        zIndex: 30,
        minWidth: '10rem',
    }),
    control: (provided) => ({
        ...provided,
        position: 'relative',
        overflow: 'unset',
        backgroundColor: '#E3722250',
        textAlign: 'left',
        width: '100%',
        borderRadius: '0.5rem',
        borderWidth: '1px',
        cursor: 'default',
        boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderColor: '#E37222',
        '&:hover': {
            borderColor: '#E37222',
        },
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#07889B50' : '#fff',
        borderRadius: '0.5rem',
        '&: active': {
            backgroundColor: '#66B9BF50',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#374151',
        fontSize: '0.875rem',
        fontWeight: 'light',
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#07889B',
        borderRadius: '0.5rem',
        color: '#fff',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#fff',
        fontSize: '0.875rem',
        fontWeight: 'lighter',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        '&:hover': {
            backgroundColor: '#D93B3B',
            color: '#fff',
            borderTopRightRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
        },
    }),
};

export const ComboBox: React.FC = React.memo(() => {
    const { authUser } = useFirebaseAuth();

    const options = useEditorStore(useCallback((state) => state.options, []));
    const isLoadingCategories = useEditorStore(
        useCallback((state) => state.isLoadingCategories, []),
    );
    const setSelectedCategories = useEditorStore(
        useCallback((state) => state.setSelectedCategories, []),
    );
    const createCategory = useEditorStore(
        useCallback((state) => state.createCategory, []),
    );

    return (
        <CreatableSelect
            isLoading={isLoadingCategories}
            className="react-select"
            classNamePrefix="rstw"
            styles={customStyles}
            isMulti
            onCreateOption={(value) => createCategory(value, authUser)}
            onChange={(value) => setSelectedCategories(value)}
            options={options}
        />
    );
});
