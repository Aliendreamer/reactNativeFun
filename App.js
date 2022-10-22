import { Root } from "./screens/root";
import { UserProvider } from './helpers/usercontext';
import { LanguageProvider } from './helpers/languagecontext';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
export default function App() {
	return (
		<UserProvider>
			<LanguageProvider>
				<Root />
			</LanguageProvider>
		</UserProvider>
	);
}
