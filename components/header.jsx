import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, Appbar, Switch } from 'react-native-paper';

import { StorageKeys } from '../helpers/constants';
import { UserContext } from '../contexts/usercontext';

export function CustomHeader({ navigation, back }) {
    const theme = useTheme();
    const {
        state: { isThemeDark },
        setThemeState,
    } = useContext(UserContext);
    const toggleTheme = async () => {
        setThemeState(!isThemeDark);
        await AsyncStorage.setItem(StorageKeys.APPTHEME, `${!isThemeDark}`);
    };
    return (
        <Appbar.Header
            theme={{
                colors: {
                    primary: theme?.colors.surface,
                },
            }}
        >
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Switch
                style={[
                    {
                        ...styles.toggleTheme,
                        backgroundColor: theme.colors.accent,
                    },
                ]}
                onValueChange={toggleTheme}
                value={isThemeDark}
            />
        </Appbar.Header>
    );
}
const styles = StyleSheet.create({
    toggleTheme: {
        right: 10,
        position: 'absolute',
    },
});
