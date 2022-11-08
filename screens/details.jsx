import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, SegmentedButtons, Checkbox } from 'react-native-paper';
import { PlayOptions, Routes } from '../helpers/constants';
import { LanguageContext } from '../contexts/languagecontext';

export function DetailScreen({ navigation }) {
    const {
        state: { languageOptions, userLevels },
        setLanguageOptions,
    } = useContext(LanguageContext);
    const [levels, setLevels] = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        ...Object.keys(userLevels)
            .sort()
            .map(() => false),
    ]);
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.text}> Choose language levels</Text>
            <Button
                style={styles.clearButton}
                compact
                mode="compact"
                onPress={() => navigation.navigate(Routes.MANAGE)}
            >
                <View style={styles.buttonView}>
                    <MaterialIcons style={styles.buttonIcon} name="create" />
                    <Text style={styles.buttonText}>edit custom lists</Text>
                </View>
            </Button>
            <Button
                style={styles.clearButton}
                compact
                mode="compact"
                onPress={() => navigation.navigate(Routes.CREATE)}
            >
                <View style={styles.buttonView}>
                    <MaterialIcons style={styles.buttonIcon} name="create" />
                    <Text style={styles.buttonText}>create new list</Text>
                </View>
            </Button>
            <Button
                style={styles.clearButton}
                compact
                mode="outlined"
                onPress={() =>
                    setLevels([false, false, false, false, false, false])
                }
            >
                <View style={styles.buttonView}>
                    <MaterialCommunityIcons
                        style={styles.buttonIcon}
                        name="broom"
                    />
                    <Text style={styles.buttonText}>clear choices</Text>
                </View>
            </Button>
            <Checkbox.Item
                label="HSK 1"
                status={levels[0] === true ? 'checked' : 'unchecked'}
                labelVariant="displayMedium"
                onPress={() => {
                    const newLevels = [...levels];
                    newLevels[0] = !levels[0];
                    setLevels([...newLevels]);
                }}
            />
            <Checkbox.Item
                label="HSK 2"
                status={levels[1] === true ? 'checked' : 'unchecked'}
                labelVariant="displayMedium"
                onPress={() => {
                    const newLevels = [...levels];
                    newLevels[1] = !levels[1];
                    setLevels([...newLevels]);
                }}
            />
            <Checkbox.Item
                label="HSK 3"
                status={levels[2] === true ? 'checked' : 'unchecked'}
                labelVariant="displayMedium"
                onPress={() => {
                    const newLevels = [...levels];
                    newLevels[2] = !levels[2];
                    setLevels([...newLevels]);
                }}
            />
            <Checkbox.Item
                label="HSK 4"
                status={levels[3] === true ? 'checked' : 'unchecked'}
                labelVariant="displayMedium"
                onPress={() => {
                    const newLevels = [...levels];
                    newLevels[3] = !levels[3];
                    setLevels([...newLevels]);
                }}
            />
            <Checkbox.Item
                label="HSK 5"
                status={levels[4] === true ? 'checked' : 'unchecked'}
                labelVariant="displayMedium"
                onPress={() => {
                    const newLevels = [...levels];
                    newLevels[4] = !levels[4];
                    setLevels([...newLevels]);
                }}
            />
            <Checkbox.Item
                label="HSK 6"
                status={levels[5] === true ? 'checked' : 'unchecked'}
                labelVariant="displayMedium"
                onPress={() => {
                    const newLevels = [...levels];
                    newLevels[5] = !levels[5];
                    setLevels([...newLevels]);
                }}
            />
            {Object.keys(userLevels)
                .sort()
                .map((key, index) => (
                    <Checkbox.Item
                        key={key}
                        label={key}
                        status={levels[5 + index + 1] ? 'checked' : 'unchecked'}
                        labelVariant="displayMedium"
                        onPress={() => {
                            const newLevels = [...levels];
                            newLevels[5 + index + 1] = !levels[6 + index + 1];
                            setLevels([...newLevels]);
                        }}
                    />
                ))}
            <View>
                <SegmentedButtons
                    style={styles.segmentedButton}
                    value={languageOptions}
                    density="small"
                    showSelectedCheck
                    onValueChange={setLanguageOptions}
                    buttons={[
                        {
                            value: PlayOptions.PlayKnown,
                            label: PlayOptions.PlayKnown,
                        },
                        {
                            value: PlayOptions.PlayUnknown,
                            label: PlayOptions.PlayUnknown,
                        },
                        {
                            value: PlayOptions.PlayAll,
                            label: PlayOptions.PlayAll,
                        },
                    ]}
                />
                <Button
                    style={styles.button}
                    compact
                    mode="contained-tonal"
                    disabled={levels.every(level => level === false)}
                    onPress={() => navigation.navigate(Routes.GAME, { levels })}
                >
                    <View style={styles.buttonView}>
                        <MaterialIcons
                            style={styles.buttonIcon}
                            name="not-started"
                        />
                        <Text style={styles.buttonText}>start</Text>
                    </View>
                </Button>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        flex: 1,
        flexDirection: 'column',
        width: '100%',
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
