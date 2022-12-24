import 'react-native-gesture-handler';
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import {
    MD3LightTheme,
    MD3DarkTheme,
    Provider as PaperProvider,
    adaptNavigationTheme,
} from 'react-native-paper';
import merge from 'deepmerge';
import { CustomHeader } from '../components/header';
import { Routes } from '../helpers/constants';
import { UserContext } from '../contexts/usercontext';
import { DetailScreen } from './details';
import { GameScreen } from './gameScreen';
import { HomeScreen } from './homescreen';
import { CreateScreen } from './createScreen';
import { ManageScreen } from './manageScreen';
import { EditScreen } from './editScreen';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});
const CombinedDefaultTheme = merge(MD3DarkTheme, DarkTheme);
const CombinedDarkTheme = merge(MD3LightTheme, LightTheme);
const Stack = createStackNavigator();

export function Root() {
    const {
        state: { isThemeDark },
    } = useContext(UserContext);
    const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
    return (
        <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen
                        name={Routes.HOME}
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name={Routes.DETAILS}
                        component={DetailScreen}
                        options={{
                            header: props => <CustomHeader {...props} />,
                        }}
                    />
                    <Stack.Screen
                        name={Routes.GAME}
                        component={GameScreen}
                        options={{
                            header: props => <CustomHeader {...props} />,
                        }}
                    />
                    <Stack.Screen
                        name={Routes.CREATE}
                        component={CreateScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name={Routes.MANAGE}
                        component={ManageScreen}
                        options={{
                            header: props => <CustomHeader {...props} />,
                        }}
                    />
                    <Stack.Screen
                        name={Routes.EDIT}
                        component={EditScreen}
                        options={{
                            header: props => <CustomHeader {...props} />,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
