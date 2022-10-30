import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useRef, useState, useCallback, useContext } from 'react';
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
} from 'react-native-paper';

import { Routes, StorageKeys } from '../helpers/constants';
import { LanguageContext } from '../helpers/languagecontext';
import { UserContext } from '../helpers/usercontext';

export function SwipeList({ data }) {
    const swiperRef = useRef();
    const {
        state: { user },
        setScores,
    } = useContext(UserContext);
    const {
        state: { currentCombination },
    } = useContext(LanguageContext);
    const [knownCards, setKnownCards] = useState(0);
    const [unknownCards, setUnknownCards] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [hint, setHint] = useState(null);
    const [cardIndex, setCardIndex] = useState(-1);
    const total = isEmpty(data) ? 0 : data.length - 1;
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const onSwipedLeft = useCallback(
        index => {
            setCardIndex(index);
            setProgress(Math.abs(index / total).toPrecision(1));
            setUnknownCards(unknownCards + 1);
            setVisible(total === index);
        },
        [total, unknownCards],
    );

    const onSwipedRight = useCallback(
        index => {
            setCardIndex(index);
            setProgress(Math.abs(index / total).toPrecision(1));
            setKnownCards(knownCards + 1);
            setVisible(total === index);
        },
        [total, knownCards],
    );

    return (
        <SafeAreaView>
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
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
                            onPress={() => navigation.navigate(Routes.DETAILS)}
                        >
                            close
                        </Button>
                        <Button
                            onPress={async () => {
                                const scores = AsyncStorage.getItem(
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
                                AsyncStorage.setItem(
                                    StorageKeys,
                                    JSON.stringify(userScores),
                                );
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
            <View style={styles.list}>
                <Swiper
                    containerStyle={styles.swiper}
                    // eslint-disable-next-line no-return-assign
                    ref={ref => (swiperRef.current = ref)}
                    disableTopSwipe
                    disableBottomSwipe
                    infinite={false}
                    overlayOpacityHorizontalThreshold={100 / 6}
                    onSwipedLeft={onSwipedLeft}
                    onSwipedRight={onSwipedRight}
                    cards={data}
                    cardIndex={0}
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
                    stackSize={3}
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
                <HelperText type="error" visible={showHint}>
                    {hint}
                </HelperText>
            </View>
            <View style={styles.buttonBar}>
                <Button
                    style={styles.button}
                    compact
                    mode="contained-tonal"
                    onPress={() => {
                        swiperRef.current.swipeBack();
                        setProgress(Math.abs(cardIndex / total).toPrecision(1));
                        const index = cardIndex - 1;
                        setCardIndex(index);
                        setVisible(total === index);
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
                        <Text style={styles.buttonText}>hint</Text>
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
        justifyContent: 'center',
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
    paragraph: {
        margin: 5,
        fontSize: 200,
        charset: 'utf-8',
        fontWeight: 900,
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
