import React, { useContext, useEffect, useState } from 'react';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export type FUser = User | null;

type IContextState = { authUser: FUser; auth: Auth; authLoading: boolean };

const FirebaseAuthContext = React.createContext<IContextState | undefined>(
    undefined,
);

const FirebaseAuthProvider = ({ children }: React.PropsWithChildren) => {
    const [authUser, setAuthUser] = useState<FUser>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const handleAuthStateChange = (fbuser: FUser) => {
        setAuthUser(fbuser);
        setAuthLoading(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) =>
            handleAuthStateChange(fbUser),
        );
        return unsubscribe;
    }, []);

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <FirebaseAuthContext.Provider value={{ authUser, auth, authLoading }}>
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
