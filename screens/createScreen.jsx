import React, { useState, useEffect } from 'react';
import { DataTable, TextInput } from 'react-native-paper';
import { SafeAreaView, StyleSheet } from 'react-native';

const optionsPerPage = [2, 3, 4];

export function CreateScreen() {
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);
    const [text, setText] = useState('test');
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <SafeAreaView>
            <TextInput value={text} onChangeText={v => setText(v)} />
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={styles.cell}>Index</DataTable.Title>
                    <DataTable.Title style={styles.cell}>
                        Symbol
                    </DataTable.Title>
                    <DataTable.Title style={styles.cell}>
                        Pinyan
                    </DataTable.Title>
                    <DataTable.Title style={styles.cell}>
                        Translate
                    </DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                    <DataTable.Cell style={styles.cell}>
                        <TextInput
                            value={text}
                            style={styles.cell}
                            onChangeText={v => setText(v)}
                        />
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>
                        <TextInput
                            value={text}
                            style={styles.cell}
                            onChangeText={v => setText(v)}
                        />
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>
                        <TextInput
                            value={text}
                            style={styles.cell}
                            onChangeText={v => setText(v)}
                        />
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>
                        <TextInput
                            value={text}
                            style={styles.cell}
                            onChangeText={v => setText(v)}
                        />
                    </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Pagination
                    page={page}
                    numberOfPages={3}
                    onPageChange={page => setPage(page)}
                    label="1-2 of 6"
                    optionsPerPage={optionsPerPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    showFastPagination
                    optionsLabel="Rows per page"
                />
            </DataTable>
        </SafeAreaView>
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
