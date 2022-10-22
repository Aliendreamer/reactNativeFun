import React,{useContext} from "react";
import {
	NavigationContainer,
	DarkTheme as NavigationDarkTheme,
	DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
	MD3DarkTheme as PaperDarkTheme,
	DefaultTheme as PaperDefaultTheme,
	Provider as PaperProvider,
} from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './homescreen';
import { DetailScreen } from './details';
import { GameScreen } from './gameScreen';
import { UserContext } from '../helpers/usercontext';
import { CustomHeader } from "../components/header";
const CombinedDefaultTheme = {
	...PaperDefaultTheme,
	...NavigationDefaultTheme,
	colors: {
		...PaperDefaultTheme.colors,
		...NavigationDefaultTheme.colors,
	},
};
const CombinedDarkTheme = {
	...PaperDarkTheme,
	...NavigationDarkTheme,
	colors: {
		...PaperDarkTheme.colors,
		...NavigationDarkTheme.colors,
	},
};
const Stack = createNativeStackNavigator();

export const Root=() =>{
	const {state:{isThemeDark}}=useContext(UserContext);
	const theme = isThemeDark ?CombinedDarkTheme:CombinedDefaultTheme;
	return (
		<PaperProvider
		theme={theme}>
				<NavigationContainer theme={theme}>
					<Stack.Navigator initialRouteName="Home">
						<Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
						<Stack.Screen name="Details" component={DetailScreen} options={{header: (props) => <CustomHeader {...props} />}} />
						<Stack.Screen name="Game" component={GameScreen} options={{header: (props) => <CustomHeader {...props} />}} />
					</Stack.Navigator>
				</NavigationContainer>
		</PaperProvider>
	);
}





