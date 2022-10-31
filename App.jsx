import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LanguageProvider } from './contexts/languagecontext';
import { UserProvider } from './contexts/usercontext';
import { Root } from './screens/root';

SplashScreen.preventAutoHideAsync();
export default function App() {
    return (
        <UserProvider>
            <LanguageProvider>
                <Root />
            </LanguageProvider>
        </UserProvider>
    );
}
