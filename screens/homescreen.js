// In App.js in a new project

import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, TextInput, Text, Pressable, FlatList, SafeAreaView } from 'react-native';
import { UserContext } from '../helpers/usercontext';


export const HomeScreen = ({ navigation }) => {
	const { state: { availableUserNames, user } } = useContext(UserContext);
	useEffect(() => {

	}, []);
	const data = [...availableUserNames, "test", "test1", "test2", "test3", "test4", "test5"].map((value, index) => {
		return { key: index, name: value }
	});
	const dataTwo = [...availableUserNames, 1, 2, 3].map((value, index) => {
		return { key: index, value: value }
	});
	const onChangeText = () => { };
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Home Screen</Text>
			<TextInput
				style={styles.input}
				onChangeText={onChangeText}
				value={user}
			/>
			<FlatList
				horizontal={true}
				style={styles.list}
				initialNumToRender={3}
				contentContainerStyle={{ paddingRight: 50 }}
				showsHorizontalScrollIndicator={false}
				scrollEventThrottle={true}
				data={data}
				renderItem={({ item }) => (
					<View style={styles.item}>
						<Text style={styles.title}>{item.name}</Text>
					</View>
				)}
				ItemSeparatorComponent={() => {
					return (
						<View
							style={{
								height: 50,
								width: 4,
								backgroundColor: "#CED0CE",

							}}
						/>
					);
				}}
				keyExtractor={(item) => item.key}
			/>
			<View>
				<Pressable
					style={styles.button}
					onPress={() => navigation.navigate('Details')}
				>
					<Text style={styles.buttonText}>Start playing</Text>
				</Pressable>
			</View>
		</View >
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		flex: 1
	},
	text: {

	},
	title: {
		fontSize: 20,
		flex: 1,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'black',
	},
	list: {
		flex: 1,
		height: 50,
		alignSelf: "center",
		width: "50%",
		maxHeight: 50
	},
	item: {
		padding: 10,
		backgroundColor: 'red',
		width: 75,
		maxWidth: 75,
		maxHeight: 50,
		height: 50,
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 15,
		paddingHorizontal: 30,
		marginLeft: 50,
		marginRight: 50,
		marginTop: 300,
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
