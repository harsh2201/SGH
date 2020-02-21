import React, { Component } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import firebase from "./config";
const database = firebase.database();

class AttendanceQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      scanned: false,
      isValid: false
    };
  }
  async componentDidMount() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({ hasPermission: status === "granted" });
  }
  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    //   this.checkUser(data)
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
  checkUser = () => {
    this.setState({ isValid: false });
    var currUser = firebase.auth().currentUser.uid;
    var uuid = "ecdae3e8187d19a6f7bc9c55d091dd35";
    var food = database.ref("/food");
    var log = database.ref("/log");
    var user = database.ref("/user");
    user
      .child(uuid)
      .once("value")
      .then(snap => {
        if (snap.exists()) {
          this.setState({ isValid: true });
          console.log("User exists");
        }

        if (!this.state.isValid) {
          alert("No User found");
          return;
        }
        food
          .child(uuid)
          .once("value")
          .then(snap => {
            if (snap.exists()) {
              alert("Alerdy Scanned once");
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
        {/* <BarCodeScanner
          onBarCodeScanned={
            this.state.scanned ? undefined : this.handleBarCodeScanned
          }
          style={StyleSheet.absoluteFillObject}
        />
        {this.state.scanned && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => this.setState({ scanned: false })}
          />
        )} */}
        <Button title={"Start scan"} onPress={this.checkUser} />
      </View>
    );
  }
}
export default AttendanceQR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
