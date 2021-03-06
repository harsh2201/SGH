import React, { Component } from "react";

import { Text, View, StyleSheet, Dimensions, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import firebase from "./config";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-whc-toast";
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
    // console.log("Called");
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
    // var uuid = "00a24bb6def3ccea853a1d55399fc311";
    var food = database.ref("/food");
    var log = database.ref("/log");
    var user = database.ref("/user");
    food.child("flag").once("value", snap => {
      // console.log("flag:" + snap.val());

      if (snap.val() !== true) {
        alert("Scanning has not started.Please Contact your Coordinator");
        this.setState({ isloading: false });
        return;
      }

      user
        .child(uuid)
        .once("value")
        .then(snap => {
          if (snap.exists()) {
            this.setState({
              isValid: true,
              Name: snap.val()["Name"],
              Incharge: snap.val()["Incharge"]
            });
            // console.log("User exists");
          }

          if (!this.state.isValid) {
            alert("No User found");
            // console.log("No User found");
            this.setState({ isloading: false });
            return;
          }

          food
            .child("user")
            .child(uuid)
            .transaction(
              snap => {
                // console.log(typeof snap, typeof null);
                // console.log("Tstart", snap);
                if (snap === null) {
                  // console.log("not scanned");
                  return currUser;
                } else {
                  alert("Already scanned once");
                  this.setState({ isloading: false });
                  return;
                }
              },
              function(error, committed, snapshot) {
                if (error) {
                  // console.log("Transaction failed abnormally!", error);
                } else if (!committed) {
                  // console.log(
                  //   "We aborted the transaction (because ada already exists)."
                  // );
                } else {
                  log
                    .child("Food")
                    .child(uuid)
                    .child(Date.now())
                    .set(currUser)
                    .then(() => {
                      // console.log(Date.now());
                      // Toast.show("Successfully scanned");
                      if (this.state.Name === undefined) {
                        if (this.state.Incharge === undefined) {
                          this.refs.toast.show(" Successfully Scanned!");
                        } else {
                          this.refs.toast.show(
                            "" + this.state.Incharge + " Successfully Scanned!"
                          );
                        }
                      } else {
                        this.refs.toast.show(
                          "" + this.state.Name + " Successfully Scanned!"
                        );
                      }
                      // alert("Successfully scanned");
                      this.setState({ isloading: false });
                    });
                }
                // console.log("Ada's data: ", snapshot.val());
              }.bind(this)
            );
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
        <Spinner
          visible={this.state.isloading}
          textContent={"Loading..."}
          textStyle={{
            color: "#FFF"
          }}
          overlayColor="rgba(0, 0, 0, 0.8)"
        />
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
            style={{
              backgroundColor: "#6A5ACD",
              height: Dimensions.get("window").height / 10,
              color: "#fff"
            }}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
        {/* <Button title={"call"} onPress={this.checkUser} /> */}
        <Toast ref="toast" />
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
