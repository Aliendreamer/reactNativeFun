import * as React from 'react';
import { View, Text, Button } from 'react-native';


export const DetailScreen = ({ navigation }) => {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Details Screen</Text>
			<Button
				title="Go to Home"
				onPress={() => navigation.navigate('Details')}
			/>
		</View>
	);
}
