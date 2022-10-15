import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './screens/homescreen';
import { DetailScreen } from './screens/details';
import { UserProvider } from './helpers/usercontext';
const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<UserProvider>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Home" component={HomeScreen} options={{
						headerShown: false
					}} />
					<Stack.Screen name="Details" component={DetailScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</UserProvider>
	);
}
