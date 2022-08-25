import React, { useContext, useEffect, useState } from 'react';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export type FUser = User | null;

type IContextState = { user: FUser; auth: Auth };

const FirebaseAuthContext = React.createContext<IContextState | undefined>(
    undefined,
);

const FirebaseAuthProvider = ({ children }: React.PropsWithChildren) => {
    const [user, setUser] = useState<FUser>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe;
    }, []);

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <FirebaseAuthContext.Provider value={{ user, auth }}>
            {children}
        </FirebaseAuthContext.Provider>
    );
};

const useFirebaseAuth = () => {
    const context = useContext(FirebaseAuthContext);
    if (context === undefined) {
        throw new Error(
            'useFirebaseAuth must be used within a FirebaseAuthProvider',
        );
    }
    return context;
};

export { FirebaseAuthProvider, useFirebaseAuth };
