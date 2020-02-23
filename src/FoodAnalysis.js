import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import Toast from "react-native-simple-toast";
import FoodChart from "./component/FoodChart";
import { Switch } from "react-native-paper";
import firebase from "./config";
const db = firebase.database();
const { width, height } = Dimensions.get("window");
export default class FoodAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false,
      isLoding: true,
      foodCount: 0
    };
  }
  componentDidMount() {
    this.setState({ isLoding: true });
    try {
      db.ref("/food/flag").on("value", snap => {
        this.setState({ value: snap.val(), isLoding: false });
      });
      db.ref("/food").on("child_added", snap => {
        console.log(snap);
        this.setState({ foodCount: this.state.foodCount + 1 });
      });
      db.ref("/food/").on("value", snap => {
        this.setState({ foodCount: snap.numChildren() - 1 });
      });
    } catch (error) {
      console.log(error);
    }
  }
  changeSwitchStatus = async () => {
    this.setState({ isLoding: true });

    this.setState({ value: !this.state.value });

    await db
      .ref("/food/flag")
      .set(!this.state.value)
      .then(() => {
        if (!this.state.value) {
          db.ref("/food/user").set({});
        }
        Toast.show("Update Success");
      })
      .catch(error => console.log(error));
  };
  render() {
    const a = 1.5;
    return (
      <View style={styles.container}>
        <View style={styles.formContent}></View>
        <Switch
          style={{
            transform: [{ scaleX: a }, { scaleY: a }],
            alignSelf: "flex-end",
            marginRight: width / 25
          }}
          value={this.state.value}
          onChange={this.changeSwitchStatus}
        ></Switch>
        <View style={styles.foodContainer}>
          <Text style={{ fontSize: 25 }}>Current Food Count </Text>
          <Text style={{ fontSize: 25 }}>{this.state.foodCount} </Text>
        </View>
        <FoodChart></FoodChart>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
    alignItems: "center"
  },
  formContent: {
    // flexDirection: "row",
    marginTop: 45
  },

  foodContainer: {
    // backgroundColor: "red",
    alignItems: "center",
    width: width,
    paddingTop: height / 25
  }
});
