import React, { useState, useRef, useEffect, useContext } from 'react';
import { DataTable, Button, TextInput } from 'react-native-paper';
import { Text, View, ScrollView, Platform, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Papa from 'papaparse';
import { isEmpty } from 'lodash';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-community/async-storage';
import TableRowsRenderer from '../components/tableRow';
import { Routes, StorageKeys } from '../helpers/constants';
import { getUserLanguageLists } from '../helpers/reusable';
import { LanguageContext } from '../contexts/languagecontext';

export function EditScreen({ route, navigation }) {
    const [page, setPage] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const {
        params: { levelName },
    } = route;
    const {
        setUserSymbolLists,
        state: { userLevels },
    } = useContext(LanguageContext);
    const itemsPerPage = 10;

    const itemValues = useRef(
        userLevels[levelName].map(level => ({
            ...level,
            hints: level.hints.join(','),
        })),
    );
    const updateValue = (index, field, value) => {
        const x = itemValues.current[index];
        x[field] = value;
        itemValues.current[index] = x;
        setRefresh(true);
    };

    const saveList = async () => {
        const data = itemValues.current
            .filter(
                object => !Object.values(object).every(value => isEmpty(value)),
            )
            .map((value, index) => {
                return {
                    id: index,
                    symbol: value.symbol,
                    hints: value.hints.split(','),
                    pronounce: value.pronounce,
                };
            });
        const csv = Papa.unparse({
            fields: ['id', 'symbol', 'pronounce', 'hints'],
            data,
        });
        if (Platform.OS !== 'web') {
            const fileDir = 'languageList/';
            const dirUri = FileSystem.documentDirectory + fileDir;
            const dirInfo = await FileSystem.getInfoAsync(dirUri);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dirUri, {
                    intermediates: true,
                });
            }
            const listFile = `${dirUri + levelName}.csv`;
            await FileSystem.writeToFileAsync(listFile, csv, {
                encoding: 'utf8',
            });
        } else {
            const existingLists = await getUserLanguageLists();
            existingLists[levelName] = data;
            await AsyncStorage.setItem(
                StorageKeys.USER_SYMBOL_LISTS,
                JSON.stringify(existingLists),
            );
            setUserSymbolLists(existingLists);
        }
        navigation.navigate(Routes.DETAILS);
    };
    const addRows = () => {
        itemValues.current.push(
            ...Array(10)
                .fill(0)
                .map(() => ({
                    symbol: '',
                    hints: '',
                    pronounce: '',
                })),
        );
        setRefresh(true);
    };
    useEffect(() => {
        if (refresh) {
            setRefresh(false);
        }
    }, [page, refresh]);
    return (
        <ScrollView horizontal={false}>
            <TextInput
                value={levelName}
                mode="outlined"
                disabled
                label="symbol list title"
                placeholder="List title"
            />
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={styles.cell}>
                        Symbol
                    </DataTable.Title>
                    <DataTable.Title style={styles.cell}>
                        Pinyan
                    </DataTable.Title>
                    <DataTable.Title style={styles.cell}>Hints</DataTable.Title>
                </DataTable.Header>
                {itemValues.current
                    .slice(
                        itemsPerPage * page,
                        itemsPerPage * page + itemsPerPage,
                    )
                    .map((value, index) => (
                        <TableRowsRenderer
                            key={index}
                            style={styles.cell}
                            index={index}
                            object={value}
                            updateValue={updateValue}
                        />
                    ))}
                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.abs(
                        Math.ceil(itemValues.current.length / itemsPerPage),
                    )}
                    onPageChange={page => setPage(page)}
                    label={`page ${page + 1} of ${Math.abs(
                        Math.ceil(itemValues.current.length / itemsPerPage),
                    )}`}
                    optionsPerPage={itemsPerPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={() => {}}
                    showFastPagination
                    optionsLabel="Rows per page"
                />
            </DataTable>
            <View style={styles.buttons}>
                <Button mode="elevated" onPress={() => addRows()}>
                    <Ionicons name="md-add" />
                    <Text> Add rows</Text>
                </Button>
                <Button mode="elevated" onPress={() => saveList()}>
                    <MaterialCommunityIcons name="content-save-all-outline" />
                    <Text>Save list</Text>
                </Button>
                <Button
                    mode="elevated"
                    onPress={() => navigation.navigate(Routes.DETAILS)}
                >
                    <Ionicons name="backspace-outline" />
                    <Text>Back to levels</Text>
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    cell: {
        width: '100%',
        padding: 0,
    },
    buttons: {
        flex: 1,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        width: '100%',
        padding: 0,
        margin: 0,
    },
});
