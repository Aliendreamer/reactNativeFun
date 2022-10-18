import { Root } from "./screens/root";
import { UserProvider } from './helpers/usercontext';

export default function App() {
	return (
		<UserProvider>
			<Root />
		</UserProvider>
	);
}
