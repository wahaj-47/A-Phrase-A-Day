import React from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	Animated,
	View,
	ActivityIndicator,
	StatusBar,
	AsyncStorage
} from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import _ from "lodash";

export default class App extends React.Component {
	state = {
		translate: false,
		buttonColorValue: new Animated.Value(0),
		containerColorValue: new Animated.Value(0),
		sentence: {}
	};

	componentDidMount() {
		// Initialize Firebase
		const firebaseConfig = {
			apiKey: "AIzaSyBrWFSykUfoY_FYFDnufSpWc7t3HnhGNew",
			authDomain: "frenchamerican-d38d6.firebaseapp.com",
			databaseURL: "https://frenchamerican-d38d6.firebaseio.com",
			projectId: "frenchamerican-d38d6",
			storageBucket: "frenchamerican-d38d6.appspot.com"
		};

		firebase.initializeApp(firebaseConfig);
		const db = firebase.firestore();

		db.collection("sentences")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					this.setState({ sentence: doc.data() });
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {
		const {
			translate,
			buttonColorValue,
			containerColorValue,
			sentence
		} = this.state;
		const buttonColor = buttonColorValue.interpolate({
			inputRange: [0, 150],
			outputRange: ["#0075b2", "#fff"]
		});
		const containerColor = containerColorValue.interpolate({
			inputRange: [0, 150],
			outputRange: ["#fff", "#0075b2"]
		});

		return (
			<View style={{ flex: 1 }}>
				<StatusBar
					animated={true}
					barStyle={!translate ? "dark-content" : "light-content"}
				/>
				<Animated.View
					style={[styles.container, { backgroundColor: containerColor }]}
				>
					{_.isEmpty(sentence) ? (
						<ActivityIndicator
							size="large"
							color={!translate ? "#0075b2" : "#fff"}
						/>
					) : (
						<Text
							style={[
								translate ? { color: "#fff" } : { color: "#0075b2" },
								styles.text
							]}
						>
							{translate ? sentence.fr : sentence.en}
						</Text>
					)}
				</Animated.View>
				<Animated.View
					style={[styles.button, { backgroundColor: buttonColor, flex: 1 }]}
				>
					<TouchableOpacity
						onPress={() => {
							this.setState({ translate: !translate });
							Animated.parallel([
								Animated.timing(buttonColorValue, {
									toValue: !translate ? 150 : 0,
									duration: 400
								}),
								Animated.timing(containerColorValue, {
									toValue: !translate ? 150 : 0,
									duration: 400
								})
							]).start();
						}}
						style={{
							flex: 1,
							width: "100%",
							height: "100%",
							justifyContent: "center",
							alignItems: "center"
						}}
					>
						<Text
							style={[
								!translate ? { color: "#fff" } : { color: "#0075b2" },
								{ fontSize: 20, fontWeight: "bold" }
							]}
						>
							Translate to{" "}
							{!translate ? <Text>French</Text> : <Text>English</Text>}
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 30
	},
	english: {
		backgroundColor: "#fff"
	},
	french: {
		backgroundColor: "#0075b2"
	},
	text: {
		fontSize: 40,
		textAlign: "center"
	},
	button: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		height: 60
	}
});
