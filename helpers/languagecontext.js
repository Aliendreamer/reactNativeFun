import React, { useReducer } from 'react';
import { ReducerActions } from "./constants";
const LanguageContext = React.createContext();
import { isEmpty } from "lodash";
import Papa from 'papaparse';
import level1 from "../assets/level1.csv";
import level2 from "../assets/level2.csv";
import level3 from "../assets/level3.csv";
import level4 from "../assets/level4.csv";
import level5 from "../assets/level5.csv";
import level6 from "../assets/level6.csv";
const languageReducer = (state, action) => {
	switch (action.type) {
		case ReducerActions.INIT_LANGUAGES:
			return {
				...state,
				...action.payload
			}
		case ReducerActions.SET_LANGUAGE_COMBINATION:
			return {
				...state,
				languageLevel: action.payload
			}
		default:
			return state;
	}
}


const LanguageProvider = ({ children }) => {
	const initialState = { levelOne: [], levelTwo: [], levelThree: [], levelFour: [], levelFive: [], levelSix: [], currentCombination: [] };
	const [state, dispatch] = useReducer(languageReducer, initialState);
	const toJson = (file) => (new Promise((resolve, reject) => {
		Papa.parse(file, {
			download: true,
			header: false,
			encoding: "utf-8",
			error(err, file) {
				reject(err)
			},
			complete: function (results) {
				if (results.errors.length) {
					return;
				}
				const data = results.data.map((result) => {
					return {
						id: result[0],
						symbol: result[1],
						pronounce: result[2],
						hints: isEmpty(result[3]) ? "" : result[3].split(";")
					}
				}).filter(Boolean);
				return resolve(data);
			}
		})
	}))

	const setLanguages = async () => {

		const levelOne = await toJson(level1);
		const levelTwo = await toJson(level2);
		const levelThree = await toJson(level3);
		const levelFour = await toJson(level4);
		const levelFive = await toJson(level5);
		const levelSix = await toJson(level6);
		const seen = levelOne.filter(Boolean).reduce((acc, level) => {
			if (!isEmpty(level.symbol) && !acc[level.symbol]) {
				acc[level.symbol] = true
				return acc;
			}
			return acc;
		}, {});
		const cleanedLevelTwo = levelTwo.filter(level => {
			if (!seen[level.symbol]) {
				seen[level.symbol] = true;
				return true;
			}
			return false;
		});
		const cleanedLevelThree = levelThree.filter(level => {
			if (!seen[level.symbol]) {
				seen[level.symbol] = true;
				return true;
			}
			return false;
		});
		const cleanedLevelFour = levelFour.filter(level => {
			if (!seen[level.symbol]) {
				seen[level.symbol] = true;
				return true;
			}
			return false;
		});
		const cleanedLevelFive = levelFive.filter(level => {
			if (!seen[level.symbol]) {
				seen[level.symbol] = true;
				return true;
			}
			return false;
		});
		const cleanedLevelSix = levelSix.filter(level => {
			if (!seen[level.symbol]) {
				seen[level.symbol] = true;
				return true;
			}
			return false;
		});
		const state = {
			levelOne: levelOne, levelTwo: cleanedLevelTwo,
			levelThree: cleanedLevelThree, levelFour: cleanedLevelFour,
			levelFive: cleanedLevelFive, levelSix: cleanedLevelSix, currentCombination: []
		}
		dispatch({ type: ReducerActions.INIT_LANGUAGES, payload: state })
	};
	const setCombination = combination => dispatch({ type: ReducerActions.SET_LANGUAGE_COMBINATION, payload: combination });

	return (
		<LanguageContext.Provider value={{ state, setCombination, setLanguages }}>
			{children}
		</LanguageContext.Provider>
	);
}

export { LanguageContext, LanguageProvider };