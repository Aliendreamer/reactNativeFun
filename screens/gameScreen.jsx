import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SwipeList } from "../components/swipeList";
import Papa from 'papaparse';
import { isEmpty } from "lodash";
import level1 from "../assets/level1.csv";
import level2 from "../assets/level2.csv";
import level3 from "../assets/level3.csv";
import level4 from "../assets/level4.csv";
import level5 from "../assets/level5.csv";
import level6 from "../assets/level6.csv";

export const GameScreen = ({ route }) => {
	const { params: { levels } } = route;
	const [data, setData] = useState([]);

	useEffect(() => {
		const config = {
			download: true,
			header: false,
			encoding: "utf-8",

			complete: function (results) {
				if (results.errors.length) {
					return;
				}
				const data = results.data.map((result) => {
					return {
						id: result[0],
						symbol: result[1],
						pronounce: result[2],
						hints: isEmpty(result[3]) ? "" : result[2].split(";")
					}
				}).filter(Boolean);
				setData(data);
			}
		};
		switch (level) {
			case 1:
				Papa.parse(level1, config);
				break;
			case 2:
				Papa.parse(level2, config);
				break;
			case 3:
				Papa.parse(level3, config);
				break;
			case 4:
				Papa.parse(level4, config);
				break;
			case 5:
				Papa.parse(level5, config);
				break;
			case 6:
				Papa.parse(level6, config);
				break;
			default:
				break;
		}
	}, []);
	return (
		<SafeAreaView style={styles.container}>
			<SwipeList data={data} />
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		flex: 1,
		width: "100%"
	},

});
