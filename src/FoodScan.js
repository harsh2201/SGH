/**
 *
 *
 * Code Sanitization left ie to sanitizze urls or any other special chars
 *
 *
 *
 *  */

import React, { Component } from "react";

import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import firebase from "./config";
import Toast from "react-native-simple-toast";
const database = firebase.database();

class FoodScan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      scanned: false,
      isValid: false,
      isloading: false
    };
  }
  async componentDidMount() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({ hasPermission: status === "granted" });
  }
  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true, isloading: true });

    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    var letters = /^[0-9a-zA-Z]+$/;
    if (data.match(letters) === null) {
      alert("Invalid QR Code!" + " \nCode: " + data);
      this.setState({ scanned: true, isloading: false });
      return;
    }
    this.checkUser(data);
  };

  checkUser = uuid => {
    this.setState({ isValid: false });
    var currUser = firebase.auth().currentUser.uid;
    console.log(uuid);
    // var uuid = "00a24bb6def3ccea853a1d55399fc311";
    var food = database.ref("/food");
    var log = database.ref("/log");
    var user = database.ref("/user");
    food.child("flag").once("value", snap => {
      console.log(snap);

      if (snap.val() !== true) {
        alert("Scanning has not started.Please Contact your Coordinator");
        this.setState({ isloading: false });
        return;
      }

      user
        .child(`${uuid}`)
        .once("value")
        .then(snap => {
          if (snap.exists()) {
            this.setState({ isValid: true });
            console.log("User exists");
          }

          if (!this.state.isValid) {
            alert("No User found");
            this.setState({ isloading: false });

            return;
          }
          food
            .child(uuid)
            .once("value")
            .then(snap => {
              if (snap.exists()) {
                alert("Already scanned once");
                this.setState({ isloading: false });

                return;
              }
              console.log("not scanned");
              food
                .child(uuid)
                .set(currUser)
                .then(() => console.log("added in food"));
              log
                .child("Food")
                .child(uuid)
                .child(Date.now())
                .set(currUser)
                .then(() => {
                  console.log(Date.now());
                  Toast.show("Successfully scanned");
                  this.setState({ isloading: false });
                });
            });
        });
    });
  };

  render() {
    if (this.state.hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (this.state.hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end"
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={
            this.state.scanned
              ? undefined
              : this.handleBarCodeScanned.bind(this)
          }
          style={StyleSheet.absoluteFillObject}
        />
        {this.state.scanned && (
          <Button
            title={"Tap to Scan Again"}
            disabled={this.state.isloading}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
        {/* <Button title={"call"} onPress={this.checkUser} /> */}
      </View>
    );
  }
}
export default FoodScan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
