import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import firebase from "./config";
import Spinner from "react-native-loading-spinner-overlay";

class authLoading extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("MainNavigator");
      } else {
        this.props.navigation.navigate("Login");
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={true}
          textContent={"Checking if logged in..."}
          textStyle={{
            color: "#FFF"
          }}
          overlayColor="rgba(0, 0, 0, 1)"
        />
      </View>
    );
  }
}
export default authLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
