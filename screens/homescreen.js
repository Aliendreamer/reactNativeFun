// In App.js in a new project

import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, TextInput, Text, Pressable, FlatList, Dimensions } from 'react-native';
import { UserContext } from '../helpers/usercontext';


export const HomeScreen = ({ navigation }) => {
	const { state: { availableUserNames, user } } = useContext(UserContext);
	useEffect(() => {

	}, []);
	const data = [...availableUserNames, "test", "test1", "test2"].map((value, index) => {
		return { key: index, name: value }
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
			<View>
				<FlatList
					horizontal={true}
					style={styles.list}
					initialNumToRender={5}
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
			</View>
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
		fontSize: 25,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'black',
	},
	list: {
		marginLeft: 50,
		flex: 1,
		height: 50,
		width: "100%"
	},
	item: {
		padding: 10,
		backgroundColor: 'red',
		width: 100,
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