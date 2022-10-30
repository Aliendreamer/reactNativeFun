import React, { useEffect, useContext, useState } from 'react';

import { SwipeList } from '../components/swipeList';
import { LanguageContext } from '../helpers/languagecontext';

export function GameScreen({ route }) {
    const {
        params: { levels },
    } = route;
    const [data, setData] = useState([]);
    const {
        state: {
            levelOne,
            levelTwo,
            levelThree,
            levelFour,
            levelFive,
            levelSix,
        },
        setCombination,
    } = useContext(LanguageContext);
    useEffect(() => {
        let index = 0;
        let dataLanguages = [];
        const combination = [];
        for (const shouldAdd of levels) {
            if (shouldAdd) {
                switch (index) {
                    case 0:
                        dataLanguages = dataLanguages.concat(levelOne);
                        combination.push(index + 1);
                        break;
                    case 1:
                        dataLanguages = dataLanguages.concat(levelTwo);
                        combination.push(index + 1);
                        break;
                    case 2:
                        dataLanguages = dataLanguages.concat(levelThree);
                        combination.push(index + 1);
                        break;
                    case 3:
                        dataLanguages = dataLanguages.concat(levelFour);
                        combination.push(index + 1);
                        break;
                    case 4:
                        dataLanguages = dataLanguages.concat(levelFive);
                        combination.push(index + 1);
                        break;
                    case 5:
                        dataLanguages = dataLanguages.concat(levelSix);
                        combination.push(index + 1);
                        break;
                    default:
                        break;
                }
            }
            index += 1;
        }
        setData(dataLanguages);
        setCombination(combination);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <SwipeList data={data} />;
}
