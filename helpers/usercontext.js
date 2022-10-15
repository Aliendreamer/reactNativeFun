import React, { useReducer } from 'react';
import { ReducerActions } from "./constants";
const UserContext = React.createContext();

const userReducer = (state, action) => {
	switch (action.type) {
		case ReducerActions.INIT_USER:
			return {
				...state,
				user: action.payload
			}

		case ReducerActions.SET_LANGUAGE_LEVEL:
			return {
				...state,
				languageLevel: action.payload
			}

		case ReducerActions.SET_SCORE:
			return {
				...state,
				scores: scores.push(action.payload)
			}
		case ReducerActions.SET_SCORES:
			return {
				...state,
				scores: action.payload
			}
		case ReducerActions.SET_USER_NAMES:
			return {
				...state,
				availableUserNames: action.payload
			}
		default:
			return state;
	}
}


const UserProvider = ({ children }) => {
	const initialState = { user: "", languageLevel: null, scores: [], availableUserNames: [] };
	const [state, dispatch] = useReducer(userReducer, initialState);

	const setUser = userName => dispatch({ type: ReducerActions.INIT_USER, payload: userName });
	const setLanguageLevel = language => dispatch({ type: ReducerActions.SET_LANGUAGE_LEVEL, payload: language });
	const setScore = score => dispatch({ type: ReducerActions.SET_SCORE, payload: score });
	const setScores = scores => dispatch({ type: ReducerActions.SET_SCORES, payload: scores });
	const setUserNames = availableUserNames => dispatch({ type: ReducerActions.SET_USER_NAMES, payload: availableUserNames });

	return (
		<UserContext.Provider value={{ state, setUser, setLanguageLevel, setScore, setScores, setUserNames }}>
			{children}
		</UserContext.Provider>
	);
}

export { UserContext, UserProvider };