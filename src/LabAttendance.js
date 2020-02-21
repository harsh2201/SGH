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
  Dimensions
} from "react-native";
import { Button } from "react-native-paper";
import { Linking } from "expo";

import firebase from "./config";

export default class Calls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      labFlag: false,
      volLab: ""
    };
  }

  async componentDidMount() {
    var db = firebase.database();
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    let volLab = "";
    let partis = [];

    let labFlag;
    await db.ref("lab/flag/").on("value", async snapshot => {
      // console.log(snapshot.val());
      labFlag = snapshot.val();
      this.setState({ labFlag: labFlag });
      if (labFlag === true) {
        volLab = await db
          .ref("volunteer/" + uid + "/Lab/")
          .once("value")
          .then(snapshot => {
            // console.log(snapshot.val());
            return snapshot.val();
          });
        this.setState({ volLab: volLab });
        let tempPartis;
        await db.ref("lab/" + volLab + "/").on("value", snapshot => {
          // console.log(snapshot.val());
          tempPartis = snapshot.val();
          partis = [];
          for (let item in tempPartis) {
            partis.push(tempPartis[item]);
          }
          this.setState({ participants: partis });
        });
        console.log(this.state.participants);
      }
    });
    // console.log(labFlag);
  }

  _handleCall = Mobile => {
    var str = Mobile;
    // var phoneString = str.replace(/-/g, "");
    var phoneString = str;
    str.console.log(phoneString);
    const url = `tel:${phoneString}`;
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
      // <TouchableOpacity activeOpacity={1}>
      <View style={styles.row}>
        <Image source={{ uri: icon }} style={styles.pic} />
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTxt}>{item.Name}</Text>
          </View>
          <View style={styles.end}>
            {/* <Image
              style={[
                styles.icon,
                { marginLeft: 15, marginRight: 5, width: 14, height: 14 }
              ]}
              source={{
                uri: "https://img.icons8.com/small/14/000000/double-tick.png"
              }}
            /> */}
            <Text style={styles.time}>
              {item.date} {item.time}
            </Text>
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
      // </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.labFlag ? (
          <Button
            icon="qrcode"
            mode="outlined"
            style={{
              marginHorizontal: Dimensions.get("window").width / 7,
              marginVertical: 10
              // backgroundColor: "#FF6501c5"
            }}
            onPress={() =>
              this.props.navigation.navigate("AttendanceQR", {
                volLab: this.state.volLab
              })
            }
          >
            Scan for attendance
          </Button>
        ) : null}

        <FlatList
          extraData={this.state}
          data={this.state.participants}
          keyExtractor={item => {
            return item.id;
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
    paddingVertical: 20,
    justifyContent: "space-evenly"
    // alignContent: "space-between"
  },
  pic: {
    borderRadius: 25,
    width: 50,
    height: 50
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
    fontSize: 12
  },
  icon: {
    height: 40,
    width: 40
    // marginRight: 40
    // backgroundColor: "red"
  }
});
