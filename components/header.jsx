import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, Appbar, TouchableRipple, Switch } from 'react-native-paper';

import { StorageKeys } from '../helpers/constants';
import { UserContext } from '../helpers/usercontext';

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
            <TouchableRipple
                style={styles.toggleTheme}
                onPress={() => toggleTheme()}
            >
                <Switch
                    style={[{ backgroundColor: theme.colors.accent }]}
                    value={isThemeDark}
                />
            </TouchableRipple>
        </Appbar.Header>
    );
}
const styles = StyleSheet.create({
    toggleTheme: {
        right: 10,
        position: 'absolute',
    },
});
