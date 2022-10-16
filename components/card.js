import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
const { height } = Dimensions.get('window')
import { CardColors } from '../helpers/constants'
const Card = ({ card }) => (
	<View
		activeOpacity={1}
		style={styles.card}
	>
		<Image
			style={styles.image}
			source={card.photo}
			resizeMode="cover"
		/>
		<View style={styles.photoDescriptionContainer}>
			<Text style={styles.text}>
				text
			</Text>
		</View>
	</View>
)

StyleSheet.create({
	card: {
		height: height - 300,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: CardColors.white,
		borderRadius: 5,
		shadowColor: CardColors.black,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 6,
		shadowOpacity: 0.3,
		elevation: 2,
	},
	image: {
		borderRadius: 5,
		flex: 1,
		width: '100%',
	},
	photoDescriptionContainer: {
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		flexDirection: 'column',
		height: '100%',
		position: 'absolute',
		left: 10,
		bottom: 10,
	},
	text: {
		textAlign: 'center',
		fontSize: 20,
		color: CardColors.white,
		fontFamily: 'Avenir',
		textShadowColor: CardColors.black,
		textShadowRadius: 10,
	},
})
export default Card