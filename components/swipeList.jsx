import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useRef, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

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

import {
    isMobileDevice,
    Routes,
    StorageKeys,
    SwipeDirection,
    languageDirectory,
} from '../helpers/constants';
import { LanguageContext } from '../contexts/languagecontext';
import { UserContext } from '../contexts/usercontext';
import { writeFileToSystem } from '../helpers/reusable';

export function SwipeList() {
    const swiperRef = useRef();
    const {
        state: { user, scores },
        setScores,
    } = useContext(UserContext);
    const {
        state: {
            currentCombination,
            previouslyKnown,
            previouslyUnknown,
            playSymbols: data,
        },
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
        setProgress(+Math.abs((index + 1) / total).toFixed(1));
        setUnknownCards(unknownCards + 1);
        if (recordUnknown) {
            unknownIeropgliph.push(data[index]?.symbol);
            setunknownIeropgliph([...unknownIeropgliph]);
        }
        setVisible(total === index);
        lastDirection.current = SwipeDirection.LEFT;
    };

    const onSwipedRight = index => {
        setCardIndex(index);
        setProgress(+Math.abs((index + 1) / total).toFixed(1));
        setKnownCards(knownCards + 1);
        if (recordUnknown) {
            knownIeropgliph.push(data[index]?.symbol);
            setKnownIeropgliph([...knownIeropgliph]);
        }

        setVisible(total === index);
        lastDirection.current = SwipeDirection.RIGHT;
    };

    const updateWordLists = async () => {
        const newKnownList = [
            ...new Set(previouslyKnown.concat(knownIeropgliph)),
        ].filter(Boolean);
        const newUnknownList = [
            ...new Set(previouslyUnknown.concat(unknownIeropgliph)),
        ].filter(Boolean);
        if (isMobileDevice) {
            const knownFile = `${
                languageDirectory + StorageKeys.KnownSymbols
            }.json`;
            await writeFileToSystem(knownFile, newKnownList);

            const unknownFile = `${
                languageDirectory + StorageKeys.UnknownSymbols
            }.json`;
            await writeFileToSystem(unknownFile, newUnknownList);
        } else {
            await AsyncStorage.multiSet([
                [StorageKeys.KnownSymbols, JSON.stringify(newKnownList)],
                [StorageKeys.UnknownSymbols, JSON.stringify(newUnknownList)],
            ]);
        }

        setUserWordsLists({
            previouslyKnown: newKnownList,
            previouslyUnknown: newUnknownList,
        });
    };

    return (
        <View style={styles.view}>
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
                            {'\n'}
                            total:
                            {
                                +Math.abs(
                                    (knownCards / (total + 1)) * 100,
                                ).toFixed(2)
                            }
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={async () => {
                                await updateWordLists();
                                setVisible(false);
                                navigation.navigate(Routes.DETAILS);
                            }}
                        >
                            close
                        </Button>
                        <Button
                            onPress={async () => {
                                scores.push({
                                    user,
                                    levels: currentCombination,
                                    score: +Math.abs(
                                        (knownCards / (total + 1)) * 100,
                                    ).toFixed(2),
                                });
                                if (isMobileDevice) {
                                    const listFile = `${
                                        languageDirectory +
                                        StorageKeys.USERSCORES
                                    }.json`;
                                    await writeFileToSystem(listFile, scores);
                                } else {
                                    await AsyncStorage.setItem(
                                        StorageKeys.USERSCORES,
                                        JSON.stringify(scores),
                                    );
                                }
                                setScores(scores);
                                await updateWordLists();
                                setVisible(false);
                                navigation.navigate(Routes.DETAILS);
                            }}
                        >
                            save result
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Text style={{ marginHorizontal: 10 }} variant="titleMedium">
                {`Current cards progress ${' '} ${
                    cardIndex === -1 ? 0 : cardIndex + 1
                }:${data.length}`}
            </Text>
            <ProgressBar progress={progress} color={MD3Colors.error50} />
            <View style={styles.view}>
                <View style={styles.bar}>
                    <View style={styles.unknownCheck}>
                        <Text style={styles.textUnknown} variant="titleSmall">
                            unknown {unknownCards}
                        </Text>
                    </View>
                    <View style={styles.knownCheck}>
                        <Text style={styles.textKnown} variant="titleSmall">
                            known {knownCards}
                        </Text>
                    </View>
                </View>
                <View style={styles.bar}>
                    <View style={styles.unknownCheck}>
                        <Text
                            style={{
                                alignSelf: 'center',
                                color: 'red',
                                textAlign: 'center',
                            }}
                            variant="titleSmall"
                        >
                            Record unknown
                        </Text>
                        <Checkbox
                            status={recordUnknown ? 'checked' : 'unchecked'}
                            onPress={() => setRecordUnknown(!recordUnknown)}
                        />
                    </View>
                    <View style={styles.knownCheck}>
                        <Text
                            style={{
                                alignSelf: 'center',
                                textAlign: 'center',
                                color: 'green',
                            }}
                            variant="titleSmall"
                        >
                            Record known
                        </Text>
                        <Checkbox
                            status={recordKnown ? 'checked' : 'unchecked'}
                            onPress={() => setRecordKnown(!recordKnown)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.list}>
                <Swiper
                    containerStyle={styles.swiper}
                    ref={swiper => {
                        swiperRef.current = swiper;
                    }}
                    disableTopSwipe
                    disableBottomSwipe
                    infinite={false}
                    backgroundColor={theme.colors.background}
                    overlayOpacityHorizontalThreshold={100 / 4}
                    onSwipedLeft={onSwipedLeft}
                    onSwipedRight={onSwipedRight}
                    cards={data}
                    pointerEvents="auto"
                    cardStyle={styles.card}
                    renderCard={card => {
                        if (!card) return null;
                        return (
                            <View>
                                <Text style={styles.paragraph}>
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
                            element: (
                                <Text style={{ color: 'red' }}>Unknown</Text>
                            ),
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
                            element: (
                                <Text style={{ color: 'green' }}>Known</Text>
                            ),
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
                    icon="step-backward"
                    mode="outlined"
                    onPress={() => {
                        swiperRef.current.swipeBack();
                        const index = cardIndex - 1;
                        setProgress(+Math.abs(index / total).toFixed(1));
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
                    retry last
                </Button>
                <Button
                    style={styles.button}
                    icon="close-circle"
                    mode="outlined"
                    onPress={() => swiperRef.current.swipeLeft()}
                >
                    unknown
                </Button>
                <Button
                    style={styles.button}
                    icon="translate"
                    mode="outlined"
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
                    translate
                </Button>
                <Button
                    style={styles.button}
                    icon="head-question"
                    mode="outlined"
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
                    pinyin
                </Button>
                <Button
                    style={styles.button}
                    icon="check-bold"
                    mode="outlined"
                    onPress={() => swiperRef.current.swipeRight()}
                >
                    known
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    list: {
        marginTop: 5,
        height: 350,
        maxHeight: 350,
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
    progress: {
        flex: 1,
        flexWrap: 'wrap',
        marginHorizontal: 10,
        width: '100%',
        maxWidth: '100%',
    },
    bar: {
        marginHorizontal: 5,
        flex: 1,
        alignContent: 'space-between',
        flexWrap: 'wrap',
    },
    unknownCheck: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    knownCheck: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    textKnown: {
        color: 'green',
    },
    textUnknown: {
        color: 'red',
    },
    paragraph: {
        margin: 5,
        fontSize: 200,
        charset: 'utf-8',
        fontWeight: 'normal',
        textAlign: 'center',
    },
    buttonIcon: {
        fontSize: 20,
        marginHorizontal: 5,
    },
    button: {
        margin: 1,
    },
    buttonBar: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        width: '100%',
        margin: 10,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    buttonBarHelp: {
        marginTop: 1,
        marginBottom: 5,
        marginHorizontal: '25%',
        justifyContent: 'center',
    },
});
