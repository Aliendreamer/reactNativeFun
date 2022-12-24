import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import { LanguageContext } from '../contexts/languagecontext';
import {
    isMobileDevice,
    languageDirectory,
    StorageKeys,
    Routes,
} from '../helpers/constants';

export function ManageScreen({ navigation }) {
    const {
        state: { userLevels },
        setLanguageOptions,
    } = useContext(LanguageContext);
    const deleteList = useCallback(
        async key => {
            delete userLevels[key];
            if (isMobileDevice) {
                const file = `${languageDirectory}${key}.json`;
                await FileSystem.deleteAsync(file, { idempotent: true });
                setLanguageOptions(userLevels);
                return;
            }
            await AsyncStorage.removeItem(StorageKeys.USER_SYMBOL_LISTS);
            await AsyncStorage.setItem(
                StorageKeys.USER_SYMBOL_LISTS,
                JSON.stringify(userLevels),
            );
            setLanguageOptions(userLevels);
        },
        [userLevels, setLanguageOptions],
    );
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.text}> Edit existing list</Text>
            {Object.keys(userLevels)
                .sort()
                .map((key, index) => (
                    <View key={index} style={styles.row}>
                        <Text variant="titleMedium">{key}</Text>
                        <Button
                            style={styles.button}
                            mode="contained-tonal"
                            icon="circle-edit-outline"
                            onPress={() =>
                                navigation.navigate(Routes.EDIT, {
                                    levelName: key,
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Edit</Text>
                        </Button>
                        <Button
                            style={styles.button}
                            icon="delete"
                            mode="contained-tonal"
                            onPress={() => deleteList(key)}
                        >
                            Delete
                        </Button>
                    </View>
                ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        flex: 1,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'space-between',
        flex: 1,
    },
    text: {
        margin: 20,
        fontSize: 30,
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        margin: 10,
    },
});
