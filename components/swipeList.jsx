import React, { useRef } from 'react';
import Swiper from 'react-native-deck-swiper';
import { StyleSheet, View, Text } from 'react-native';
export const SwipeList = ({ data }) => {
	const swiperRef = useRef();
	const cardIndex = 0;
	const cardNum = 0;
	const swipeDirection = "";
	const isSwipingBack = false;
	const renderCard = card => {
		if (!card) {
			return null;
		}
		return (
			<View style={styles.card}>
				<Text style={styles.text}>{card.id}</Text>
				<Text style={styles.paragraph}>{card.symbol}</Text>
			</View>
		);
	};

	const onSwipedAllCards = () => {

	};

	const onSwiped = () => {

	};
	const onTapCard = () => {
	};




	return (
		<View style={styles.container} >
			<Swiper
				style={styles.swiper}
				ref={swiper => swiperRef.current = swiper}
				disableTopSwipe={true}
				disableBottomSwipe={true}
				infinite={false}
				onTapCardDeadZone={5}
				onSwiped={onSwiped}
				onTapCard={onTapCard}
				cards={data}
				jumpToCardIndex={() => { }}
				swipeBack={() => { }}
				cardIndex={cardIndex}
				cardVerticalMargin={80}
				renderCard={renderCard}
				onSwipedAll={onSwipedAllCards}
				verticalSwipe={false}
				horizontalSwipe={true}
				showSecondCard={false}
				overlayLabels={{
					left: {
						title: 'NOPE',
						swipeColor: '#FF6C6C',
						backgroundOpacity: '0.75',
						fontColor: '#FFF',
					},
					right: {
						title: 'LIKE',
						swipeColor: '#4CCC93',
						backgroundOpacity: '0.75',
						fontColor: '#FFF',
					}
				}}
				animateOverlayLabelsOpacity
				animateCardOpacity
			/>
		</View >
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	swiper: {
		paddingTop: 0,
	},
	card: {
		flex: 1,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#E8E8E8',
		justifyContent: 'center',
		backgroundColor: 'white',
	},

	text: {
		textAlign: 'center',
		fontSize: 50,
		backgroundColor: 'transparent',
	},
	paragraph: {
		margin: 24,
		fontSize: 18,
		charset: "utf-8",
		fontWeight: 'bold',
		textAlign: 'center',
	}
});