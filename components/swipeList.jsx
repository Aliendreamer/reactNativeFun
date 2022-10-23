import React, { useRef,useState } from 'react';
import Swiper from 'react-native-deck-swiper';
import { StyleSheet,SafeAreaView, View } from 'react-native';
import {Button,HelperText, ProgressBar,Portal,Dialog, MD3Colors,Text } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

export const SwipeList = ({ data }) => {
	const swiperRef = useRef();
	const knownCards = useRef(0);
	const unknownCards = useRef(0);
	const [showHint,setShowHint]=useState(false);
	const [hint,setHint]=useState(null);
	const [cardIndex,setCardIndex] = useState(-1);
	const total = data.length;
	const [progress,setProgress] =useState(0);
	const [visible, setVisible] = useState(false);
	const renderCard = card => {
		if (!card) {
			return null;
		}
		return (
			<View>
				<Text disabled={true} style={styles.paragraph}>{card.symbol}</Text>
			</View>
		);
	};

	const onSwipedAllCards = () => {
		debugger;
		setVisible(true);
	};

	const onSwipedLeft = (index) => {
		setCardIndex(index);
		setProgress(Math.abs(index/total).toPrecision(1));
		setShowHint(false);
		unknownCards.current++;
	};

	const onSwipedRight = (index) => {
		setCardIndex(index);
		setProgress(Math.abs(index/total).toPrecision(1));
		setShowHint(false);
		knownCards.current++;
	};


	return (
		<SafeAreaView>
		<Portal>
			<Dialog visible={visible} onDismiss={()=>setVisible(false)}>
            <Dialog.Title>Final result</Dialog.Title>
            <Dialog.Content>
				<Text>
					You finished with result:
					{'\n'}
					known:{knownCards.current} unknown: {unknownCards.current}
					total:{(knownCards.current/total)*100}
				</Text>
            </Dialog.Content>
            <Dialog.Actions>
			<Button onPress={()=>setVisible(false)}>close</Button>
			<Button onPress={()=>{
				setVisible(false)
				}}>save result</Button>
		</Dialog.Actions>
			</Dialog>
        </Portal>
			<View style={styles.progressBar}>
				<Text variant="titleMedium">Current cards progress</Text>
			<ProgressBar progress={progress} color={MD3Colors.error100} />
			</View>
			<View style={styles.list}>
			<Swiper
				containerStyle={styles.swiper}
				ref={ref => swiperRef.current = ref}
				disableTopSwipe={true}
				disableBottomSwipe={true}
				infinite={false}
				overlayOpacityHorizontalThreshold={100/6}
				onSwipedLeft={onSwipedLeft}
				onSwipedRight={onSwipedRight}
				cards={data}
				pointerEvents="auto"
				cardIndex={0}
				cardStyle={styles.card}
				renderCard={renderCard}
				onSwipedAll={onSwipedAllCards}
				verticalSwipe={false}
				horizontalSwipe={true}
				stackSize={2}
				showSecondCard={true}
				overlayLabels={{
					left: {
						element: <Text>Unknown</Text> ,
						title: 'Unknown',
						style: {
							label: {
							backgroundColor: 'black',
							borderColor: 'black',
							color: 'white',
							borderWidth: 1
						},
						wrapper: {
							flexDirection: 'column',
							alignItems: 'flex-end',
							justifyContent: 'flex-start',
							marginTop: 30,
							marginLeft: -30
							}
						}
					},
					right: {
						element: <Text>Known</Text> ,
						title: 'Known',
						style: {
							label: {
							backgroundColor: 'black',
							borderColor: 'black',
							color: 'white',
							borderWidth: 1
						},
						wrapper: {
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							marginTop: 30,
							marginLeft: 30
							}
						}
					},
				}}
				animateOverlayLabelsOpacity
				animateCardOpacity
			/>
			</View>
			<View style={styles.buttonBarHelp}>
				<HelperText type="error" visible={showHint}>
					{hint}
				</HelperText>
			</View>
			<View style={styles.buttonBar}>
				<Button style={styles.button} compact={true} mode="contained-tonal" onPress={() =>{
					swiperRef.current.swipeBack();
					setProgress(Math.abs((cardIndex)/total).toPrecision(1));
					const index= cardIndex-1;
					setCardIndex(index);
					setVisible(index===total-1);
					showHint(false);
				}}>
					<View style={styles.buttonView}>
						<AntDesign name="stepbackward" style={styles.buttonIcon} />
						<Text  style={styles.buttonText}>retry last</Text>
					</View>
				</Button>
				<Button style={styles.button} compact={true} mode="contained-tonal" onPress={() => {
						const index= cardIndex+1;
						setCardIndex(index);
						setProgress(Math.abs(index/total).toPrecision(1));
						swiperRef.current.swipeLeft();
						setShowHint(false);
					}}>
					<View style={styles.buttonView}>
						<AntDesign name="closecircle" style={styles.buttonIcon} />
						<Text  style={styles.buttonText}>unknown</Text>
					</View>
				</Button>
				<Button style={styles.button} compact={true} mode="contained-tonal" onPress={() =>{
					const card =data[cardIndex];
					const hint = card.hints.join(",");
					setHint(hint);
					setShowHint(true);
				}}>
					<View style={styles.buttonView}>
						<AntDesign name="questioncircle" style={styles.buttonIcon}/>
						<Text  style={styles.buttonText}>hint</Text>
					</View>
				</Button>
				<Button style={styles.button} compact={true} mode="contained-tonal" onPress={() =>{
					const index= cardIndex+1;
					setCardIndex(index);
					setProgress(Math.abs(index/total).toPrecision(1));
					setShowHint(false);
					swiperRef.current.swipeRight();
				}}>
					<View style={styles.buttonView}>
						<AntDesign name="checkcircle" style={styles.buttonIcon} />
						<Text  style={styles.buttonText}>known</Text>
					</View>
				</Button>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	list:{
		paddingTop: 10,
		height:500,
		maxHeight:500,
		justifyContent:"center"
	},
	swiper: {
		paddingTop: 10,
		marginHorizontal:"15%",
		justifyContent:"center"
	},
	card: {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		width: "auto",
		height: "auto",
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#E8E8E8',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	progressBar:{
		margin:10
	},
	paragraph: {
		margin: 5,
		fontSize: 200,
		charset: "utf-8",
		fontWeight: 900,
		textAlign: 'center',
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
	},
	buttonBar:{
		flex:1,
		flexDirection:"row",
		marginHorizontal:"25%",
		justifyContent:"space-evenly"
	},
	buttonBarHelp:{
		margin:5,
		marginHorizontal:"25%",
		justifyContent:"center"
	}
});