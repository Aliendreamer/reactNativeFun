/* eslint-disable import/extensions */
import { isEmpty } from 'lodash';
import React, { useCallback, useMemo, useReducer } from 'react';
import { PlayOptions, ReducerActions } from '../helpers/constants';
import {
    filterUniqueSymbols,
    getLanguageListsFromStorage,
    getUserLanguageLists,
} from '../helpers/reusable';
import level1 from '../assets/level1.json';
import level2 from '../assets/level2.json';
import level3 from '../assets/level3.json';
import level4 from '../assets/level4.json';
import level5 from '../assets/level5.json';
import level6 from '../assets/level6.json';

const LanguageContext = React.createContext();
const languageReducer = (state, action) => {
    switch (action.type) {
        case ReducerActions.INIT_LANGUAGES:
            return {
                ...state,
                ...action.payload,
            };
        case ReducerActions.SET_LANGUAGE_COMBINATION:
            return {
                ...state,
                languageLevel: action.payload,
            };
        case ReducerActions.SET_LANGUAGE_OPTIONS:
            return {
                ...state,
                languageOptions: action.payload,
            };
        case ReducerActions.SET_USER_WORDS_LISTS:
            return {
                ...state,
                previouslyKnown: action.payload.previouslyKnown,
                previouslyUnknown: action.payload.previouslyUnknown,
            };
        case ReducerActions.UPDATE_USER_LANGUAGE_LISTS: {
            return {
                ...state,
                userLevels: action.payload,
            };
        }
        case ReducerActions.EDIT_USER_LANGUAGE_LIST: {
            const levels = { ...state.userLevels };
            levels[action.payload.levelName] = action.payload.data;
            return {
                ...state,
                userLevels: levels,
            };
        }
        default:
            return state;
    }
};

function LanguageProvider({ children }) {
    const initialState = {
        levelOne: [],
        levelTwo: [],
        levelThree: [],
        levelFour: [],
        levelFive: [],
        levelSix: [],
        userLevels: {},
        currentCombination: [],
        languageOptions: PlayOptions.PlayAll,
        previouslyKnown: [],
        previouslyUnknown: [],
    };
    const [state, dispatch] = useReducer(languageReducer, initialState);

    const setLanguages = useCallback(async () => {
        const levelOne = level1;
        const levelTwo = level2;
        const levelThree = level3;
        const levelFour = level4;
        const levelFive = level5;
        const levelSix = level6;
        const userSymbolLists = await getUserLanguageLists();
        const { knownArray, unknownArray } =
            await getLanguageListsFromStorage();
        const seen = levelOne.filter(Boolean).reduce((acc, level) => {
            if (!isEmpty(level.symbol) && !acc[level.symbol]) {
                acc[level.symbol] = true;
                return acc;
            }
            return acc;
        }, {});
        const cleanedLevelTwo = levelTwo.filter(level =>
            filterUniqueSymbols(level, seen),
        );
        const cleanedLevelThree = levelThree.filter(level =>
            filterUniqueSymbols(level, seen),
        );
        const cleanedLevelFour = levelFour.filter(level =>
            filterUniqueSymbols(level, seen),
        );
        const cleanedLevelFive = levelFive.filter(level =>
            filterUniqueSymbols(level, seen),
        );
        const cleanedLevelSix = levelSix.filter(level =>
            filterUniqueSymbols(level, seen),
        );
        for (const list of Object.keys(userSymbolLists)) {
            userSymbolLists[list] = userSymbolLists[list].filter(level =>
                filterUniqueSymbols(level, seen),
            );
        }
        const state = {
            levelOne,
            levelTwo: cleanedLevelTwo,
            levelThree: cleanedLevelThree,
            levelFour: cleanedLevelFour,
            levelFive: cleanedLevelFive,
            levelSix: cleanedLevelSix,
            userLevels: userSymbolLists,
            currentCombination: [],
            languageOptions: PlayOptions.PlayAll,
            previouslyKnown: knownArray,
            previouslyUnknown: unknownArray,
        };
        dispatch({ type: ReducerActions.INIT_LANGUAGES, payload: state });
    }, []);
    const setCombination = combination =>
        dispatch({
            type: ReducerActions.SET_LANGUAGE_COMBINATION,
            payload: combination,
        });
    const setLanguageOptions = option =>
        dispatch({
            type: ReducerActions.SET_LANGUAGE_OPTIONS,
            payload: option,
        });
    const setUserWordsLists = lists =>
        dispatch({ type: ReducerActions.SET_USER_WORDS_LISTS, payload: lists });

    const setUserSymbolLists = lists =>
        dispatch({
            type: ReducerActions.UPDATE_USER_LANGUAGE_LISTS,
            payload: lists,
        });
    const editUserLanguageList = data =>
        dispatch({
            type: ReducerActions.EDIT_USER_LANGUAGE_LIST,
            payload: data,
        });
    const contentValue = useMemo(() => {
        return {
            state,
            setCombination,
            setLanguages,
            setLanguageOptions,
            setUserWordsLists,
            setUserSymbolLists,
            editUserLanguageList,
        };
    }, [state, setLanguages]);
    return (
        <LanguageContext.Provider value={contentValue}>
            {children}
        </LanguageContext.Provider>
    );
}

export { LanguageContext, LanguageProvider };
