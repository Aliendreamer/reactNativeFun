import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useRef, useState, useContext } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {
    Button,
    HelperText,
    ProgressBar,
    Portal,
    Dialog,
    MD3Colors,
    Text,
    Divider,
    useTheme,
    Checkbox,
} from 'react-native-paper';

import { Routes, StorageKeys, SwipeDirection } from '../helpers/constants';
import { LanguageContext } from '../contexts/languagecontext';
import { getLanguageListsFromStorage } from '../helpers/reusable';
import { UserContext } from '../contexts/usercontext';

export function SwipeList({ data }) {
    const swiperRef = useRef();
    const {
        state: { user },
        setScores,
    } = useContext(UserContext);
    const {
        state: { currentCombination },
        setUserWordsLists,
    } = useContext(LanguageContext);
    const theme = useTheme();
    const [knownCards, setKnownCards] = useState(0);
    const [unknownCards, setUnknownCards] = useState(0);
    const [knownIeropgliph, setKnownIeropgliph] = useState([]);
    const [unknownIeropgliph, setunknownIeropgliph] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [hint, setHint] = useState(null);
    const [pronounce, setPronounce] = useState(null);
    const [showPronounce, setShowPronounce] = useState(null);
    const [cardIndex, setCardIndex] = useState(-1);
    const total = isEmpty(data) ? 0 : data.length - 1;
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();
    const lastDirection = useRef(SwipeDirection.RIGHT);
    const [recordKnown, setRecordKnown] = useState(true);
    const [recordUnknown, setRecordUnknown] = useState(true);

    const onSwipedLeft = index => {
        setCardIndex(index);
        setProgress(Math.abs(index / total).toPrecision(1));
        setUnknownCards(unknownCards + 1);
        if (recordUnknown) {
            unknownIeropgliph.push(data[index].symbol);
            setunknownIeropgliph([...unknownIeropgliph]);
        }
        setVisible(total === index);
        lastDirection.current = SwipeDirection.LEFT;
    };

    const onSwipedRight = index => {
        setCardIndex(index);
        setProgress(Math.abs(index / total).toPrecision(1));
        setKnownCards(knownCards + 1);
        if (recordUnknown) {
            knownIeropgliph.push(data[index].symbol);
            setKnownIeropgliph([...knownIeropgliph]);
        }

        setVisible(total === index);
        lastDirection.current = SwipeDirection.RIGHT;
    };

    const updateWordLists = async () => {
        const { knownArray, unknownArray } =
            await getLanguageListsFromStorage();

        const newKnownList = [...new Set(knownArray.concat(knownIeropgliph))];
        const newUnknownList = [
            ...new Set(unknownArray.concat(unknownIeropgliph)),
        ];
        await AsyncStorage.multiSet([
            [StorageKeys.KnownSymbols, JSON.stringify(newKnownList)],
            [StorageKeys.UnknownSymbols, JSON.stringify(newUnknownList)],
        ]);
        setUserWordsLists({
            previouslyKnown: newKnownList,
            previouslyUnknown: newUnknownList,
        });
    };

    return (
        <SafeAreaView>
            <Portal>
                <Dialog
                    visible={visible}
                    onDismiss={async () => {
                        await updateWordLists();
                        setVisible(false);
                    }}
                >
                    <Dialog.Title>Final result</Dialog.Title>
                    <Dialog.Content>
                        <Text>
                            You finished with result:
                            {'\n'}
                            known:{knownCards} unknown: {unknownCards}
                            total:{((knownCards / total) * 100).toPrecision(2)}
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={async () => {
                                await updateWordLists();
                                navigation.navigate(Routes.DETAILS);
                            }}
                        >
                            close
                        </Button>
                        <Button
                            onPress={async () => {
                                const scores = await AsyncStorage.getItem(
                                    StorageKeys.USERSCORES,
                                );
                                const userScores = isEmpty(scores)
                                    ? []
                                    : JSON.parse(scores);
                                userScores.push({
                                    user,
                                    levels: currentCombination,
                                    score: (
                                        (knownCards / total) *
                                        100
                                    ).toPrecision(2),
                                });
                                setScores(userScores);
                                await AsyncStorage.setItem(
                                    StorageKeys,
                                    JSON.stringify(userScores),
                                );
                                await updateWordLists();
                                navigation.navigate(Routes.DETAILS);
                            }}
                        >
                            save result
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <View style={styles.progressBar}>
                <Text variant="titleMedium">Current cards progress</Text>
                <ProgressBar progress={progress} color={MD3Colors.error100} />
            </View>
            <View style={styles.textBar}>
                <Text style={styles.textUnknown} variant="titleLarge">
                    unknown: {unknownCards}
                </Text>
                <Text style={styles.textKnown} variant="titleLarge">
                    known: {knownCards}
                </Text>
            </View>
            <View style={styles.list}>
                <View style={styles.knownCheck}>
                    <Text variant="titleMedium">Record known</Text>
                    <Checkbox
                        status={recordKnown ? 'checked' : 'unchecked'}
                        onPress={() => setRecordKnown(!recordKnown)}
                    />
                </View>
                <View style={styles.unknownCheck}>
                    <Text variant="titleMedium">Record unknown</Text>
                    <Checkbox
                        status={recordUnknown ? 'checked' : 'unchecked'}
                        onPress={() => setRecordUnknown(!recordUnknown)}
                    />
                </View>
                <Swiper
                    containerStyle={styles.swiper}
                    // eslint-disable-next-line no-return-assign
                    ref={ref => (swiperRef.current = ref)}
                    disableTopSwipe
                    disableBottomSwipe
                    infinite={false}
                    backgroundColor={theme.colors.background}
                    overlayOpacityHorizontalThreshold={100 / 6}
                    onSwipedLeft={onSwipedLeft}
                    onSwipedRight={onSwipedRight}
                    cards={data}
                    pointerEvents="auto"
                    // cardIndex={cardIndex}
                    cardStyle={styles.card}
                    renderCard={card => {
                        if (!card) {
                            return null;
                        }
                        return (
                            <View>
                                <Text disabled style={styles.paragraph}>
                                    {card.symbol}
                                </Text>
                            </View>
                        );
                    }}
                    verticalSwipe={false}
                    swipeBackCard
                    horizontalSwipe
                    stackSize={2}
                    showSecondCard
                    overlayLabels={{
                        left: {
                            element: <Text>Unknown</Text>,
                            title: 'Unknown',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: -30,
                                },
                            },
                        },
                        right: {
                            element: <Text>Known</Text>,
                            title: 'Known',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: 30,
                                },
                            },
                        },
                    }}
                    animateOverlayLabelsOpacity
                    animateCardOpacity
                />
            </View>
            <View style={styles.buttonBarHelp}>
                <HelperText
                    type="error"
                    visible={showHint}
                    style={{ textAlign: 'center' }}
                >
                    {hint}
                </HelperText>
                {showHint && showPronounce && <Divider />}
                <HelperText
                    style={{ textAlign: 'center' }}
                    type="info"
                    visible={showPronounce}
                >
                    {pronounce}
                </HelperText>
            </View>
            <View style={styles.buttonBar}>
                <Button
                    style={styles.button}
                    compact
                    mode="contained-tonal"
                    onPress={() => {
                        swiperRef.current.swipeBack();
                        const index = cardIndex - 1;
                        setProgress(Math.abs(index / total).toPrecision(1));
                        setCardIndex(index);
                        setVisible(total === index);
                        const isRight =
                            lastDirection.current === SwipeDirection.RIGHT;
                        if (isRight && recordKnown) {
                            setKnownCards(knownCards - 1);
                            knownIeropgliph.pop();
                            setKnownIeropgliph([...knownIeropgliph]);
                        }
                        if (!isRight && recordUnknown) {
                            setUnknownCards(unknownCards - 1);
                            unknownIeropgliph.pop();
                            unknownIeropgliph([...unknownIeropgliph]);
                        }
                    }}
                >
                    <View style={styles.buttonView}>
                        <AntDesign
                            name="stepbackward"
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>retry last</Text>
                    </View>
                </Button>
                <Button
                    style={styles.button}
                    compact
                    mode="contained-tonal"
                    onPress={() => {
                        swiperRef.current.swipeLeft();
                        const index = cardIndex + 1;
                        setCardIndex(index);
                        setVisible(total === index);
                        setProgress(Math.abs(index / total).toPrecision(1));
                    }}
                >
                    <View style={styles.buttonView}>
                        <AntDesign
                            name="closecircle"
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>unknown</Text>
                    </View>
                </Button>
                <Button
                    style={styles.button}
                    compact
                    mode="contained-tonal"
                    onPress={() => {
                        const card = data[cardIndex + 1];
                        const hint = card.hints.join(',');
                        setHint(hint);
                        setShowHint(true);
                        setTimeout(() => {
                            setShowHint(false);
                        }, 2000);
                    }}
                >
                    <View style={styles.buttonView}>
                        <AntDesign
                            name="questioncircle"
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>translate</Text>
                    </View>
                </Button>
                <Button
                    style={styles.button}
                    compact
                    mode="contained-tonal"
                    onPress={() => {
                        const card = data[cardIndex + 1];
                        const { pronounce } = card;
                        setPronounce(pronounce);
                        setShowPronounce(true);
                        setTimeout(() => {
                            setShowPronounce(false);
                        }, 2000);
                    }}
                >
                    <View style={styles.buttonView}>
                        <AntDesign
                            name="questioncircle"
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>pinyin</Text>
                    </View>
                </Button>
                <Button
                    style={styles.button}
                    compact
                    mode="contained-tonal"
                    onPress={() => {
                        swiperRef.current.swipeRight();
                        const index = cardIndex + 1;
                        setCardIndex(index);
                        setProgress(Math.abs(index / total).toPrecision(1));
                        setVisible(total === index);
                    }}
                >
                    <View style={styles.buttonView}>
                        <AntDesign
                            name="checkcircle"
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>known</Text>
                    </View>
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingTop: 10,
        height: 500,
        maxHeight: 500,
    },
    knownCheck: {
        position: 'absolute',
        left: 20,
    },
    unknownCheck: {
        position: 'absolute',
        right: 20,
    },
    swiper: {
        paddingTop: 10,
        marginHorizontal: '15%',
        justifyContent: 'center',
    },
    card: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 'auto',
        height: 'auto',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    progressBar: {
        margin: 10,
    },
    textBar: {
        margin: 10,
        flexDirection: 'row',
    },
    textKnown: {
        marginLeft: '80%',
        maxWidth: 150,
        width: 150,
        color: 'green',
    },
    textUnknown: {
        maxWidth: 150,
        marginStart: 10,
        width: 150,
        color: 'red',
    },
    paragraph: {
        margin: 5,
        fontSize: 200,
        charset: 'utf-8',
        fontWeight: 900,
        textAlign: 'center',
    },
    buttonIcon: {
        fontSize: 20,
        marginHorizontal: 5,
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
    buttonBar: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: '25%',
        justifyContent: 'space-evenly',
    },
    buttonBarHelp: {
        margin: 5,
        marginHorizontal: '25%',
        justifyContent: 'center',
    },
});
