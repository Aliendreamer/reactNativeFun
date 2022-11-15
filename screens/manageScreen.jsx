import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { LanguageContext } from '../contexts/languagecontext';
import { Routes, StorageKeys } from '../helpers/constants';

export function ManageScreen({ navigation }) {
    const {
        state: { userLevels },
        setLanguageOptions,
    } = useContext(LanguageContext);
    const deleteList = useCallback(
        async key => {
            delete userLevels[key];
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
                            compact
                            mode="contained-tonal"
                            onPress={() =>
                                navigation.navigate(Routes.EDIT, {
                                    levelName: key,
                                })
                            }
                        >
                            <View style={styles.buttonView}>
                                <MaterialIcons
                                    name="mode-edit"
                                    style={styles.buttonIcon}
                                />
                                <Text style={styles.buttonText}>Edit</Text>
                            </View>
                        </Button>
                        <Button
                            style={styles.button}
                            compact
                            mode="contained-tonal"
                            onPress={() => deleteList(key)}
                        >
                            <View style={styles.buttonView}>
                                <MaterialIcons
                                    name="delete"
                                    style={styles.buttonIcon}
                                />
                                <Text style={styles.buttonText}>Delete</Text>
                            </View>
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
    buttonIcon: {
        fontSize: 20,
    },
    buttonView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'normal',
    },
    button: {
        margin: 10,
    },
    clearButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 200,
        width: 200,
        margin: 10,
    },
    segmentedButton: {
        justifyContent: 'center',
        alignItems: 'stretch',
    },
});
