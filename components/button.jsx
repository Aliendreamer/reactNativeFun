import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const IconButton = ({ onPress, name, backgroundColor, color }) => (
	<TouchableOpacity
		style={[styles.singleButton, { backgroundColor }]}
		onPress={onPress}
		activeOpacity={0.85}
	>
		<Icon
			name={name}
			size={20}
			color={color}
		/>
	</TouchableOpacity>
)

StyleSheet.create({
	singleButton: {
		backgroundColor: 'transparent',
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 6,
		shadowOpacity: 0.3,
		elevation: 2,
		padding: 15,
	},
})
export default IconButton