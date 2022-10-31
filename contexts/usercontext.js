import React, { useMemo, useReducer } from 'react';

import { ReducerActions } from '../helpers/constants';

const UserContext = React.createContext();

const userReducer = (state, action) => {
    switch (action.type) {
        case ReducerActions.INIT_USER:
            return {
                ...state,
                user: action.payload,
            };
        case ReducerActions.SET_SCORE:
            return {
                ...state,
                scores: state.scores.push(action.payload),
            };
        case ReducerActions.SET_SCORES:
            return {
                ...state,
                scores: action.payload,
            };
        case ReducerActions.SET_USER_NAMES:
            return {
                ...state,
                availableUserNames: action.payload,
            };
        case ReducerActions.SET_LAUNCH_STATE:
            return {
                ...state,
                availableUserNames: action.payload.usernames,
                user: action.payload.user,
                scores: action.payload.scores,
                isThemeDark: action.payload.isThemeDark,
            };
        case ReducerActions.SET_THEME_STATE:
            return {
                ...state,
                isThemeDark: action.payload,
            };
        default:
            return state;
    }
};

function UserProvider({ children }) {
    const initialState = {
        user: '',
        isThemeDark: true,
        scores: [],
        availableUserNames: [],
    };
    const [state, dispatch] = useReducer(userReducer, initialState);

    const setUser = userName =>
        dispatch({ type: ReducerActions.INIT_USER, payload: userName });
    const setScore = score =>
        dispatch({ type: ReducerActions.SET_SCORE, payload: score });
    const setScores = scores =>
        dispatch({ type: ReducerActions.SET_SCORES, payload: scores });
    const setUserNames = availableUserNames =>
        dispatch({
            type: ReducerActions.SET_USER_NAMES,
            payload: availableUserNames,
        });
    const setLaunchState = state =>
        dispatch({ type: ReducerActions.SET_LAUNCH_STATE, payload: state });
    const setThemeState = state =>
        dispatch({ type: ReducerActions.SET_THEME_STATE, payload: state });

    const contentValue = useMemo(() => {
        return {
            state,
            setUser,
            setScore,
            setScores,
            setLaunchState,
            setUserNames,
            setThemeState,
        };
    }, [state]);
    return (
        <UserContext.Provider value={contentValue}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };
