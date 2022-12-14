import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from 'lodash';
import * as FileSystem from 'expo-file-system';
import { StorageKeys, isMobileDevice, languageDirectory } from './constants';

export const getLanguageListsFromStorage = async () => {
    if (isMobileDevice) {
        const dirExist = directoryExist();
        if (!dirExist) {
            return { knownArray: [], unknownArray: [] };
        }
        try {
            const unknownUri = `${languageDirectory}${StorageKeys.UnknownSymbols}.json`;
            const knownUri = `${languageDirectory}${StorageKeys.KnownSymbols}.json`;
            const knownInfo = await FileSystem.getInfoAsync(knownUri);
            const unknownInfo = await FileSystem.getInfoAsync(unknownUri);
            let knownSymbols = [];
            let unknownSymbols = [];
            if (knownInfo.exists) {
                const known = await FileSystem.readAsStringAsync(knownUri);

                knownSymbols = JSON.parse(known);
            }
            if (unknownInfo.exists) {
                const unknown = await FileSystem.readAsStringAsync(unknownUri);
                unknownSymbols = JSON.parse(unknown);
            }

            return { knownArray: knownSymbols, unknownArray: unknownSymbols };
        } catch (error) {
            return { knownArray: [], unknownArray: [] };
        }
    }
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
    if (isMobileDevice) {
        const dirExist = directoryExist();
        if (!dirExist) {
            return {};
        }
        const fileNames = await FileSystem.readDirectoryAsync(
            languageDirectory,
        );
        const languageFiles = fileNames.filter(
            fileName =>
                fileName.endsWith('.json') &&
                !fileName.includes(StorageKeys.KnownSymbols) &&
                !fileName.includes(StorageKeys.UnknownSymbols) &&
                !fileName.includes(StorageKeys.USER) &&
                !fileName.includes(StorageKeys.USERSCORES),
        );
        const userFiles = {};

        for await (const file of languageFiles) {
            const current = languageDirectory + file;
            const content = await FileSystem.readAsStringAsync(current);
            const symbols = JSON.parse(content);
            const currentListName = file.split('.')[0];
            userFiles[currentListName] = symbols;
        }
        return userFiles;
    }
    const list = await AsyncStorage.getItem(StorageKeys.USER_SYMBOL_LISTS);
    const parsedlist = isEmpty(list) ? {} : JSON.parse(list);
    return parsedlist;
};

export const directoryExist = async () => {
    const dirInfo = await FileSystem.getInfoAsync(languageDirectory);
    return dirInfo.exists;
};

export const writeFileToSystem = async (uri, data) =>
    FileSystem.writeAsStringAsync(uri, JSON.stringify(data), {
        encoding: 'utf8',
    });
