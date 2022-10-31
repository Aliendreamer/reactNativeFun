// In App.js in a new project

import AsyncStorage from '@react-native-community/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { isEmpty } from 'lodash';
import React, {
    useEffect,
    useCallback,
    useState,
    useContext,
    useRef,
} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, Text, Button, useTheme } from 'react-native-paper';

import { Routes, StorageKeys } from '../helpers/constants';
import { LanguageContext } from '../contexts/languagecontext';
import { UserContext } from '../contexts/usercontext';

export function HomeScreen({ navigation }) {
    const {
        state: { availableUserNames, scores, user },
        setUser,
        setLaunchState,
    } = useContext(UserContext);
    const { setLanguages } = useContext(LanguageContext);
    const mount = useRef(true);
    const [appIsReady, setAppIsReady] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (mount.current) {
            (async () => {
                const user = await AsyncStorage.getItem(StorageKeys.USER);
                const userScores = await AsyncStorage.getItem(
                    StorageKeys.USERSCORES,
                );
                const userAvailableNames = await AsyncStorage.getItem(
                    StorageKeys.USERNAMES,
                );
                const theme = await AsyncStorage.getItem(StorageKeys.APPTHEME);
                const scores = isEmpty(userScores)
                    ? []
                    : JSON.parse(userScores);
                const usernames = isEmpty(userAvailableNames)
                    ? []
                    : JSON.parse(userAvailableNames);
                const isThemeDark = theme === 'true';
                await setLanguages();
                setLaunchState({
                    user: user ?? '',
                    scores,
                    usernames,
                    isThemeDark,
                });
                setAppIsReady(true);
            })();
            mount.current = false;
        }
    }, [setLanguages, setLaunchState]);
    const noUser = isEmpty(user);
    const data = [...availableUserNames].map((value, index) => {
        return { key: index, name: value };
    });

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <View
            style={{ ...styles.container, backgroundColor: theme.background }}
            onLayoutRootView={onLayoutRootView}
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
                autoFocus
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
                scrollEventThrottle
                data={data}
                scrollEnabled
                renderItem={({ item }) => (
                    <Text
                        style={styles.item}
                        onPress={async event => {
                            const userName = event.target.innerText;
                            await AsyncStorage.setItem(StorageKeys.USER, user);
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
                    navigation.navigate(Routes.DETAILS);
                    await AsyncStorage.setItem(StorageKeys.USER, user);
                    const names = await AsyncStorage.getItem(
                        StorageKeys.USERNAMES,
                    );
                    const nameList = isEmpty(names) ? [] : JSON.parse(names);
                    const shouldAdd = nameList.includes(user);
                    if (shouldAdd) {
                        nameList.push(user);
                        await AsyncStorage.setItem(
                            StorageKeys.USERNAMES,
                            JSON.stringify(nameList),
                        );
                    }
                }}
            >
                <Text style={styles.buttonText}>
                    {noUser ? 'enter nickname' : 'start playing'}
                </Text>
            </Button>
            <View style={styles.score}>
                {scores.length !== 0 && <Text>Top Scores</Text>}
                {scores.slice(0, 3).map((userScore, index) => (
                    <Text key={index}>{userScore.score}</Text>
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
