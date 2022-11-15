import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from 'lodash';
import { StorageKeys } from './constants';

export const getLanguageListsFromStorage = async () => {
    const currentList = await AsyncStorage.multiGet([
        StorageKeys.KnownSymbols,
        StorageKeys.UnknownSymbols,
    ]);
    const knownArray = isEmpty(currentList[0][1])
        ? []
        : JSON.parse(currentList[0][1]);

    const unknownArray = isEmpty(currentList[1][1])
        ? []
        : JSON.parse(currentList[1][1]);
    return { knownArray, unknownArray };
};

export const filterUniqueSymbols = (level, seen) => {
    if (!seen[level.symbol]) {
        seen[level.symbol] = true;
        return true;
    }
    return false;
};
export const getUserLanguageLists = async () => {
    const list = await AsyncStorage.getItem(StorageKeys.USER_SYMBOL_LISTS);
    const parsedlist = isEmpty(list) ? {} : JSON.parse(list);
    return parsedlist;
};
