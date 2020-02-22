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
import { Linking } from "expo";
import { BarCodeScanner } from "expo-barcode-scanner";
import firebase from "./config";
import Toast from "react-native-simple-toast";
const database = firebase.database();

class AttendanceQR extends Component {
  constructor(props) {
    const { state } = props.navigation;
    super(props);
    this.state = {
      hasPermission: null,
      scanned: false,
      isValid: false,
      isloading: false,
      volLab: state.params.volLab
    };
  }
  async componentDidMount() {
    // console.log(this.state.volLab);
    // console.log(firebase.auth().currentUser.uid);
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
    var labRef = database.ref("/lab");
    var volLabRef = labRef.child("/" + this.state.volLab);
    var log = database.ref("/log");
    // var user = database.ref("/user");
    labRef.child("flag").once("value", snap => {
      console.log(snap.val());
      if (snap.val() !== true) {
        alert("Scanning has not started. Please Contact your Coordinator");
        this.setState({ isloading: false });
        return;
      }

      volLabRef
        .child(uuid)
        .once("value")
        .then(snap => {
          if (snap.exists()) {
            this.setState({ isValid: true });
            console.log("Participant exists");
          }

          if (!this.state.isValid) {
            alert("Participant not in this lab");
            this.setState({ isloading: false });

            return;
          }
          volLabRef
            .child(uuid)
            .once("value")
            .then(snap => {
              if (snap.val()["taken"] === true) {
                alert("Already scanned once");
                // console.log("not scanned");
                this.setState({ isloading: false });
                return;
              }
              var today = new Date();
              var date =
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();
              var time =
                today.getHours() +
                ":" +
                today.getMinutes() +
                ":" +
                today.getSeconds();
              var dateTime = date + " " + time;
              volLabRef
                .child(uuid + "/")
                .update({ taken: true, time: dateTime })
                .then(() => console.log("Attendance Taken"));
              log
                .child("lab/" + this.state.volLab + "/")
                .child(uuid)
                .child(Date.now())
                .update({ volunteer: currUser, time: dateTime })
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
export default AttendanceQR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
