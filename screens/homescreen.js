// In App.js in a new project

import React, { useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, TextInput, Text, Pressable, FlatList } from 'react-native';
import { UserContext } from '../helpers/usercontext';
import AsyncStorage from '@react-native-community/async-storage';
import { StorageKeys } from '../helpers/constants';
import { isEmpty } from "lodash";

export const HomeScreen = ({ navigation }) => {
	const { state: { availableUserNames, scores, user }, setUser, setLaunchState } = useContext(UserContext);
	useEffect(() => {
		(async () => {
			const user = await AsyncStorage.getItem(StorageKeys.USER);
			const userScores = await AsyncStorage.getItem(StorageKeys.USERSCORES);
			const userAvailableNames = await AsyncStorage.getItem(StorageKeys.USERNAMES);
			const scores = isEmpty(userScores) ? [1, 2, 3] : JSON.parse(userScores);
			const usernames = isEmpty(userAvailableNames) ? [] : JSON.parse(userAvailableNames);
			setLaunchState({ user: user ?? "", scores, usernames });
		})();
	}, []);
	const noUser = isEmpty(user);
	const data = [...availableUserNames, "test", "test1", "test2", "test3", "test4", "test5"].map((value, index) => {
		return { key: index, name: value }
	});
	const eventHandler = useCallback(async (value) => {
		await AsyncStorage.setItem(StorageKeys.USER, value);
		setUser(value);
	}, []);
	return (
		<View style={styles.container}>
			<Text style={styles.text}
				ellipsizeMode="clip"
				numberOfLines={5}
			>
				Want to test your knowledge?
				Create or choose a nickname and start playing</Text>
			<TextInput
				style={styles.input}
				autoFocus={true}
				blurOnSubmit={true}
				onChangeText={eventHandler}
				placeholder="enter nickname"
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
						<Text style={styles.title} onPress={async (event) => {
							const userName = event.target.innerText;
							await AsyncStorage.setItem(StorageKeys.USER, userName);
							setUser(userName);
						}} >
							{item.name}
						</Text>
					</View>
				)
				}
				ItemSeparatorComponent={() => {
					return (
						<View
							style={{
								height: 50,
								width: 2,
								backgroundColor: "#CED0CE",

							}}
						/>
					);
				}}
				keyExtractor={(item) => item.key}
			/>
			< View >
				{noUser && <Text>button disabled</Text>}
				<Pressable
					style={noUser ? { ...styles.button, backgroundColor: "white" } : styles.button}
					disabled={noUser}
					onPress={() => navigation.navigate('Details')}
				>
					<Text style={styles.buttonText}>Start playing</Text>
				</Pressable>
			</View >
			<Text>Top Scores</Text>
			<View>
				{scores.slice(0, 3).map((score, index) => (
					<Text key={index}>
						{score}
					</Text>
				))}
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
