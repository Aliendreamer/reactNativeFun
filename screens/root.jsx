import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import {
    MD2DarkTheme,
    MD2LightTheme,
    Provider as PaperProvider,
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

const CombinedDefaultTheme = merge(MD2DarkTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(MD2LightTheme, NavigationDarkTheme);

const Stack = createNativeStackNavigator();

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
