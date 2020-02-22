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
        console.log(snap.numChildren());
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
      .then(() => Toast.show("Update Success"))
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
          <Text style={{ fontSize: 25 }}>Food Count </Text>
          <Text style={{ fontSize: 25 }}>{this.state.foodCount} </Text>
        </View>
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
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 45
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    margin: 10
  },
  foodContainer: {
    // backgroundColor: "red",
    flex: 1,
    alignItems: "center",
    width: width,
    paddingTop: height / 25
  },
  icon: {
    width: 30,
    height: 30
  },
  iconBtnSearch: {
    alignSelf: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: "center"
  },
  notificationList: {
    marginTop: 20,
    padding: 10
  },
  card: {
    height: null,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    borderTopWidth: 40,
    marginBottom: 20
  },
  cardContent: {
    flexDirection: "row",
    marginLeft: 10
  },
  imageContent: {
    marginTop: -40
  },
  tagsContent: {
    marginTop: 10,
    flexWrap: "wrap"
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    alignSelf: "center"
  },
  btnColor: {
    padding: 10,
    borderRadius: 40,
    marginHorizontal: 3,
    backgroundColor: "#eee",
    marginTop: 5
  }
});
