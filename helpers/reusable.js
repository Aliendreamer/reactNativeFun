import AsyncStorage from '@react-native-community/async-storage';
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
