import * as React from 'react';
import { Text, Pressable, SafeAreaView, StyleSheet } from 'react-native';


export const DetailScreen = ({ navigation }) => {
	return (
		<SafeAreaView style={styles.container}>
			<Pressable
				style={styles.button}
				onPress={() => navigation.navigate('Game', { level: 1 })}
			>
				<Text style={styles.buttonText}>Level 1</Text>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => navigation.navigate('Game', { level: 2 })}
			>
				<Text style={styles.buttonText}>Level 2</Text>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => navigation.navigate('Game', { level: 3 })}
			>
				<Text style={styles.buttonText}>Level 3</Text>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => navigation.navigate('Game', { level: 4 })}
			>
				<Text style={styles.buttonText}>Level 4</Text>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => navigation.navigate('Game', { level: 5 })}
			>
				<Text style={styles.buttonText}>Level 5</Text>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => navigation.navigate('Game', { level: 6 })}
			>
				<Text style={styles.buttonText}>Level 6</Text>
			</Pressable>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'space-around',
		flexDirection: "row",
		width: "100%"
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 10,
		marginLeft: 1,
		minWidth: 60,
		marginRight: 1,
		marginTop: 5,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: 'red',
	},
	buttonText: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'black',
	}
});
