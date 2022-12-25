import React, { useState, useRef, useEffect, useContext } from 'react';
import { DataTable, TextInput } from 'react-native-paper';
import { ScrollView, Platform, StyleSheet } from 'react-native';
import { isEmpty } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TableRowsRenderer from '../components/tableRow';
import { Routes, StorageKeys, languageDirectory } from '../helpers/constants';
import { getUserLanguageLists, writeFileToSystem } from '../helpers/reusable';
import { LanguageContext } from '../contexts/languagecontext';
import { EditCreateButtons } from '../components/edit_create_buttons';

export function EditScreen({ route, navigation }) {
    const [page, setPage] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const {
        params: { levelName },
    } = route;
    const {
        setUserSymbolLists,
        editUserLanguageList,
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
        if (Platform.OS !== 'web') {
            const listFile = `${languageDirectory}${levelName}.json`;
            userLevels[levelName] = data;
            await writeFileToSystem(listFile, data);
            editUserLanguageList({ levelName, data });
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
            <EditCreateButtons
                addRows={addRows}
                saveList={saveList}
                navigation={navigation}
            />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        width: '100%',
        padding: 0,
        margin: 0,
    },
});
