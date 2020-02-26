import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { Button } from "react-native-paper";
import { Linking } from "expo";
import { Avatar, PButton, Card, Title, Paragraph } from "react-native-paper";

import firebase from "./config";

export default class AbsentList extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     title: navigation.getParam("otherParam", "A Nested Details Screen" + this.state.volLab)
  //   };
  // };
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      labFlag: false,
      volLab: "",
      isLoading: true
    };
  }

  async componentDidMount() {
    var db = firebase.database();
    var partis = [];
    var tempPartis;

    // Fetching Absent Lab participants
    await db.ref("AbsentList/").on("value", snapshot => {
      tempPartis = snapshot.val();
      partis = [];
      for (var item in tempPartis) {
        partis.push(tempPartis[item][0]);
        if (tempPartis[item] !== undefined) {
          tempPartis[item]["count"] = 0;
          var obj = {};
          for (var x in tempPartis[item]) {
            if (x !== "count") {
              tempPartis[item]["count"] += 1;
              obj = tempPartis[item][x];
            }
          }
        }
        obj["count"] = tempPartis[item]["count"];
        if (obj !== undefined) {
          partis.push(obj);
        }
      }
      partis = partis.filter(function(element) {
        return element !== undefined;
      });
      this.setState({ isLoading: false, participants: partis });
      console.log("" + this.state.participants);
      // this.setState({  });
    });
  }

  _handleCall = Mobile => {
    const url = `tel:${Mobile}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url).catch(() => null);
      }
    });
  };

  renderItem = ({ item }) => {
    var callIcon = "https://img.icons8.com/doodle/240/000000/phone--v1.png";
    var icon = "https://img.icons8.com/plasticine/400/000000/delete-sign.png";
    if (item.taken === true) {
      icon = "https://img.icons8.com/plasticine/400/000000/checked-2.png";
    }
    return (
      <View>
        {item.Name ? (
          <View style={styles.row}>
            <Text source={{ uri: icon }} style={styles.pic}>
              {"Lab: "}
              {item["lab"]}
            </Text>
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameTxt}>
                  {item["Name"]} {" - "} {item.Type.replace("Team", "")} {" - "}
                  {item["Team ID"]} {" - Count: "} {item["count"]}
                </Text>
              </View>
              <View style={styles.end}>
                {item.taken ? (
                  <Text style={styles.time}>{"Taken at: " + item.time}</Text>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                this._handleCall(item.Mobile);
              }}
            >
              <Image
                style={[styles.icon, { marginRight: 0 }]}
                source={{ uri: callIcon }}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.isLoading ? (
          <ActivityIndicator
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
            size="large"
            color="#0000ff"
          />
        ) : this.state.participants.length === 0 ? (
          <Image
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width
            }}
            source={{
              uri:
                "https://image.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg"
            }}
          />
        ) : null}

        <FlatList
          extraData={this.state}
          data={this.state.participants}
          keyExtractor={item => {
            return item.suid;
          }}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#dcdcdc",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    padding: 10,
    // marginHorizontal: 10,
    marginVertical: 4,
    paddingVertical: 20,
    justifyContent: "space-evenly"
    // borderRadius: 15
    // alignContent: "space-between"
  },
  pic: {
    borderRadius: 25,
    width: 50,
    height: 50,
    fontSize: 20,
    marginLeft: 3
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 270
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: "600",
    color: "#222",
    fontSize: 15
  },
  mblTxt: {
    fontWeight: "200",
    color: "#777",
    fontSize: 13
  },
  end: {
    flexDirection: "row",
    alignItems: "center"
  },
  time: {
    fontWeight: "400",
    color: "#666",
    fontSize: 12,
    marginLeft: 15
  },
  icon: {
    height: 40,
    width: 40
  }
});
