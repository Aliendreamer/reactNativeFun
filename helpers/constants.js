export const ReducerActions = Object.freeze({
    INIT_USER: 'init_user',
    SET_SCORES: 'set_scores',
    SET_SCORE: 'set_score',
    SET_USER_NAMES: 'set_user_names',
    SET_LAUNCH_STATE: 'set_launch_state',
    SET_THEME_STATE: 'set_theme_state',
    INIT_LANGUAGES: 'init_languages',
    SET_LANGUAGE_COMBINATION: 'set_language_combination',
    SET_LANGUAGE_OPTIONS: 'set_language_options',
    SET_USER_WORDS_LISTS: 'set_user_words_lists',
    UPDATE_USER_LANGUAGE_LISTS: 'update_user_language_lists',
});

export const StorageKeys = Object.freeze({
    USER: 'user',
    USERNAMES: 'userNames',
    USERSCORES: 'userScores',
    APPTHEME: 'appTheme',
    KnownSymbols: 'known_symbols',
    UnknownSymbols: 'unknown_symbols',
    USER_SYMBOL_LISTS: 'userSymbolLists',
});

export const Routes = Object.freeze({
    HOME: 'home',
    DETAILS: 'details',
    GAME: 'game',
    CREATE: 'create',
});
export const PlayOptions = Object.freeze({
    PlayAll: 'Play All',
    PlayUnknown: 'Play Unknown',
    PlayKnown: 'Play Known',
});

export const SwipeDirection = Object.freeze({
    RIGHT: 'right',
    LEFT: 'left',
});
export const SymbolFields = Object.freeze({
    ID: 'id',
    SYMBOL: 'symbol',
    PRONOUNCE: 'pronounce',
    HINTS: 'hints',
});
