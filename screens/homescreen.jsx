// In App.js in a new project

import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from 'lodash';
import React, { useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, Text, Button, useTheme } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import {
    isMobileDevice,
    Routes,
    StorageKeys,
    languageDirectory,
} from '../helpers/constants';
import { LanguageContext } from '../contexts/languagecontext';
import { UserContext } from '../contexts/usercontext';
import { writeFileToSystem } from '../helpers/reusable';

export function HomeScreen({ navigation }) {
    const {
        state: { availableUserNames, scores, user },
        setUser,
        setLaunchState,
    } = useContext(UserContext);
    const { setLanguages } = useContext(LanguageContext);
    const mount = useRef(true);
    const theme = useTheme();

    useEffect(() => {
        if (mount.current) {
            (async () => {
                if (isMobileDevice) {
                    const userInfoUri = `${languageDirectory}${StorageKeys.USER}.json`;
                    const scoresInfoUri = `${languageDirectory}${StorageKeys.USERSCORES}.json`;

                    const userInfo = await FileSystem.getInfoAsync(userInfoUri);
                    const scoresInfo = await FileSystem.getInfoAsync(
                        scoresInfoUri,
                    );

                    let user = '';
                    let scores = [];
                    let usernames = [];
                    let isThemeDark = true;

                    if (userInfo.exists) {
                        const info = await FileSystem.readAsStringAsync(
                            userInfoUri,
                        );
                        const parsedInfo = JSON.parse(info);
                        user = parsedInfo?.user ?? '';
                        isThemeDark = parsedInfo?.isThemeDark ?? true;
                        usernames = parsedInfo?.usernames ?? [];
                    }
                    if (scoresInfo.exists) {
                        const scoreInfo = await FileSystem.readAsStringAsync(
                            scoresInfoUri,
                        );
                        scores = JSON.parse(scoreInfo) ?? [];
                    }
                    setLaunchState({
                        user,
                        scores,
                        usernames,
                        isThemeDark,
                    });
                } else {
                    const user = await AsyncStorage.getItem(StorageKeys.USER);
                    const userScores = await AsyncStorage.getItem(
                        StorageKeys.USERSCORES,
                    );
                    const userAvailableNames = await AsyncStorage.getItem(
                        StorageKeys.USERNAMES,
                    );
                    const theme = await AsyncStorage.getItem(
                        StorageKeys.APPTHEME,
                    );
                    const scores = isEmpty(userScores)
                        ? []
                        : JSON.parse(userScores);
                    const usernames = isEmpty(userAvailableNames)
                        ? []
                        : JSON.parse(userAvailableNames);
                    const isThemeDark = theme === 'true';
                    setLaunchState({
                        user: user ?? '',
                        scores,
                        usernames,
                        isThemeDark,
                    });
                }
                await setLanguages();
            })();
            mount.current = false;
        }
    }, [setLanguages, setLaunchState]);
    const noUser = isEmpty(user);
    const data = [...availableUserNames].map((value, index) => {
        return { key: index, name: value };
    });

    return (
        <View
            style={{ ...styles.container, backgroundColor: theme.background }}
        >
            <Text
                numberOfLines={2}
                variant="headlineMedium"
                style={styles.title}
            >
                Want to test your knowledge?
                {'\n'}
                Create or choose a nickname
            </Text>
            <TextInput
                left={<TextInput.Icon name="account" />}
                placeholder="enter nickname"
                value={user}
                mode="flat"
                label="player name"
                error={noUser}
                style={styles.text}
                onChangeText={value => setUser(value)}
            />
            {data.length !== 0 && (
                <Text Text variant="bodySmall" style={styles.listLabel}>
                    Used nicknames
                </Text>
            )}
            <FlatList
                horizontal
                style={styles.list}
                initialNumToRender={3}
                contentContainerStyle={{ paddingRight: 50 }}
                showsHorizontalScrollIndicator
                data={data}
                scrollEnabled
                renderItem={({ item }) => (
                    <Text
                        style={styles.item}
                        onPress={async event => {
                            const userName = event.target.innerText;
                            setUser(userName);
                        }}
                    >
                        {item.name}
                    </Text>
                )}
                keyExtractor={item => item.key}
            />
            <Button
                style={styles.button}
                disabled={noUser}
                icon="door"
                mode="contained"
                onPress={async () => {
                    if (isMobileDevice) {
                        const userInfoUri = `${languageDirectory}${StorageKeys.USER}.json`;
                        const userInfo = await FileSystem.getInfoAsync(
                            userInfoUri,
                        );
                        if (userInfo.exists) {
                            const info = await FileSystem.readAsStringAsync(
                                userInfoUri,
                            );
                            const parsedInfo = JSON.parse(info);
                            parsedInfo.user = user;
                            parsedInfo.usernames =
                                parsedInfo.usernames.includes(user)
                                    ? parsedInfo.usernames
                                    : parsedInfo.usernames.push(user);
                            writeFileToSystem(userInfoUri, parsedInfo);
                        } else {
                            const object = {
                                user,
                                usernames: [user],
                                isThemeDark: true,
                            };
                            writeFileToSystem(userInfoUri, object);
                        }
                    } else {
                        await AsyncStorage.setItem(StorageKeys.USER, user);
                        const names = await AsyncStorage.getItem(
                            StorageKeys.USERNAMES,
                        );
                        const nameList = isEmpty(names)
                            ? []
                            : JSON.parse(names);
                        const shouldAdd = nameList.includes(user);
                        if (shouldAdd) {
                            nameList.push(user);
                            await AsyncStorage.setItem(
                                StorageKeys.USERNAMES,
                                JSON.stringify(nameList),
                            );
                        }
                    }
                    navigation.navigate(Routes.DETAILS);
                }}
            >
                <Text style={styles.buttonText}>
                    {noUser ? 'enter nickname' : 'start playing'}
                </Text>
            </Button>
            <View style={styles.score}>
                {scores.length !== 0 && <Text>Top Scores</Text>}
                {scores.slice(0, 3).map((userScore, index) => (
                    <Text
                        key={index}
                    >{`${userScore.user} - ${userScore.score}`}</Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        flex: 1,
    },
    score: {
        marginTop: 10,
        alignSelf: 'center',
    },
    text: {
        marginHorizontal: 30,
    },
    title: {
        marginTop: 80,
        textAlign: 'center',
        marginBottom: 20,
    },
    list: {
        height: 50,
        alignSelf: 'center',
        width: '50%',
        maxHeight: 50,
    },
    item: {
        padding: 10,
        width: 75,
        maxWidth: 75,
        maxHeight: 50,
        height: 50,
        textAlign: 'center',
        numberOfLines: 1,
    },
    listLabel: {
        marginTop: 40,
        padding: 10,
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        marginTop: 10,
        borderRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
});
