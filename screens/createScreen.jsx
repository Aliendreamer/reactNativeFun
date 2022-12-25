import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    DataTable,
    Button,
    TextInput,
    Portal,
    Dialog,
} from 'react-native-paper';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { isEmpty } from 'lodash';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TableRowsRenderer from '../components/tableRow';
import {
    Routes,
    StorageKeys,
    isMobileDevice,
    languageDirectory,
} from '../helpers/constants';
import {
    getUserLanguageLists,
    directoryExist,
    writeFileToSystem,
} from '../helpers/reusable';
import { LanguageContext } from '../contexts/languagecontext';
import { EditCreateButtons } from '../components/edit_create_buttons';

export function CreateScreen({ navigation }) {
    const [title, setListTitle] = useState('');
    const [page, setPage] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const { setUserSymbolLists } = useContext(LanguageContext);
    const itemsPerPage = 8;

    const itemValues = useRef(
        Array(itemsPerPage)
            .fill(0)
            .map(() => ({
                symbol: '',
                hints: '',
                pronounce: '',
            })),
    );
    const updateValue = (index, field, value) => {
        const x = itemValues.current[index];
        x[field] = value;
        itemValues.current[index] = x;
        setRefresh(true);
    };

    const saveList = async () => {
        if (isEmpty(title)) {
            setVisible(true);
            return;
        }
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
        if (isMobileDevice) {
            const exist = directoryExist();
            if (!exist) {
                await FileSystem.makeDirectoryAsync(languageDirectory, {
                    intermediates: true,
                });
            }
            const listFile = `${languageDirectory + title}.json`;
            await writeFileToSystem(listFile, data);
            const existingLists = await getUserLanguageLists();
            existingLists[title] = data;
            setUserSymbolLists(existingLists);
        } else {
            const existingLists = await getUserLanguageLists();
            existingLists[title] = data;
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
            ...Array(itemsPerPage)
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
        <ScrollView>
            <TextInput
                value={title}
                mode="outlined"
                label="symbol list title"
                placeholder="List title"
                onChangeText={v => setListTitle(v)}
            />
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>Warning</Dialog.Title>
                    <Dialog.Content>
                        <Text>
                            You cant save the list:
                            {'\n'}
                            name is not set
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>close</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
                {itemValues?.current &&
                    itemValues?.current
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
                        Math.round(itemValues.current.length / itemsPerPage),
                    )}
                    onPageChange={page => setPage(page)}
                    label={`page ${page + 1} of ${Math.abs(
                        Math.round(itemValues.current.length / itemsPerPage),
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
    text: {
        width: '100%',
        padding: 0,
        margin: 0,
    },
});
