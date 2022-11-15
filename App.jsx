import React from 'react';
import { LanguageProvider } from './contexts/languagecontext';
import { UserProvider } from './contexts/usercontext';
import { Root } from './screens/root';

export default function App() {
    return (
        <UserProvider>
            <LanguageProvider>
                <Root />
            </LanguageProvider>
        </UserProvider>
    );
}
