import React from 'react';
import { TbLoader } from 'react-icons/tb';
import { RiCloseFill } from 'react-icons/ri';
import toast, { Toast } from 'react-hot-toast';

interface Props {
    t: Toast;
}

export const SuccessToast: React.FC<Props> = ({ t }) => (
    <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
        <div className="p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <TbLoader
                        className="w-6 h-6 text-green-400 animate-spin"
                        aria-hidden="true"
                    />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-light text-gray-900">Saved!</p>
                </div>
                <div className="flex flex-shrink-0 ml-4">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        type="button"
                        className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="sr-only">Close</span>
                        <RiCloseFill className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);
