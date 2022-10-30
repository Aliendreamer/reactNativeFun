import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LanguageProvider } from './helpers/languagecontext';
import { UserProvider } from './helpers/usercontext';
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