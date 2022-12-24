import React from 'react';
import { Button } from 'react-native-paper';
import { Text, View, StyleSheet } from 'react-native';
import { Routes } from '../helpers/constants';

function EditCreateButtons({ addRows, saveList, navigation }) {
    return (
        <View style={styles.buttons}>
            <Button
                mode="elevated"
                icon="newspaper-plus"
                onPress={() => addRows()}
            >
                <Text> Add rows</Text>
            </Button>
            <Button
                mode="elevated"
                icon="content-save-all"
                onPress={() => saveList()}
            >
                <Text>Save list</Text>
            </Button>
            <Button
                mode="elevated"
                icon="backspace"
                onPress={() => navigation.navigate(Routes.DETAILS)}
            >
                <Text> Back to levels</Text>
            </Button>
        </View>
    );
}
const styles = StyleSheet.create({
    buttons: {
        flex: 1,
        padding: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export { EditCreateButtons };
