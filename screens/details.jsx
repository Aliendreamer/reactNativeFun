import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Button,Text , Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons,MaterialIcons  } from '@expo/vector-icons';export const DetailScreen = ({ navigation }) => {
	const [levels, setLevels] = useState([false, false, false, false, false, false]);
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.text}> Choose language levels</Text>
			<Checkbox.Item label="level 1"
				status={levels[0] === true ? 'checked' : 'unchecked'}
				labelVariant='displayMedium'
				onPress={() => {
					const newLevels = [...levels];
					newLevels[0] = !levels[0];
					setLevels([...newLevels]);
				}} />
			<Checkbox.Item label="level 2"
				status={levels[1] === true ? 'checked' : 'unchecked'}
				labelVariant='displayMedium'
				onPress={() => {
					const newLevels = [...levels];
					newLevels[1] = !levels[1];
					setLevels([...newLevels]);
				}} />
			<Checkbox.Item label="level 3"
				status={levels[2] === true ? 'checked' : 'unchecked'}
				labelVariant='displayMedium'
				onPress={() => {
					const newLevels = [...levels];
					newLevels[2] = !levels[2];
					setLevels([...newLevels]);
				}} />
			<Checkbox.Item label="level 4"
				status={levels[3] === true ? 'checked' : 'unchecked'}
				labelVariant='displayMedium'
				onPress={() => {
					const newLevels = [...levels];
					newLevels[3] = !levels[3];
					setLevels([...newLevels]);
				}} />
			<Checkbox.Item label="level 5"
				status={levels[4] === true ? 'checked' : 'unchecked'}
				labelVariant='displayMedium'
				onPress={() => {
					const newLevels = [...levels];
					newLevels[4] = !levels[4];
					setLevels([...newLevels]);
				}} />
			<Checkbox.Item label="level 6"
				status={levels[5] === true ? 'checked' : 'unchecked'}
				labelVariant='displayMedium'
				onPress={() => {
					const newLevels = [...levels];
					newLevels[5] = !levels[5];
					setLevels([...newLevels]);
				}} />
			<View>
				<Button style={styles.button} compact={true} mode="contained-tonal" onPress={() => setLevels([false, false, false, false, false, false])}>
				<View style={styles.buttonView}>
					<MaterialCommunityIcons style={styles.buttonIcon} name="broom" />
					<Text  style={styles.buttonText}>clear choices</Text>
				</View>
				</Button>
				<Button style={styles.button} compact={true} mode="contained-tonal" onPress={() =>navigation.navigate("game",{levels})}>
				<View style={styles.buttonView}>
					<MaterialIcons style={styles.buttonIcon} name="not-started" />
					<Text  style={styles.buttonText}>start</Text>
				</View>
				</Button>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		flex: 1,
		flexDirection: "column",
		width: "100%"
	},
	text:{
		mar:20,
		fontSize:30,
		fontStyle:"italic",
		fontWeight:"bold",
		textAlign:"center"
	},
	buttonIcon:{
		fontSize:20
	},
	buttonView:{
		flex:1,
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center"
	},
	buttonText:{
		fontSize: 20,
		fontWeight: "normal"
	},
	button:{
		margin:10
	}
});
