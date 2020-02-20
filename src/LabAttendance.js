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

import firebase from "./config";

export default class Calls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      calls: [
        // {
        //   id: 1,
        //   name: "Mark Doe",
        //   date: "12 jan",
        //   time: "11:14 am",
        //   video: false,
        //   image:
        //     "https://img.pngio.com/correct-prompt-correct-right-icon-with-png-and-vector-format-for-correct-symbol-png-512_512.png"
        // },
        // {
        //   id: 2,
        //   name: "Clark Man",
        //   date: "12 jul",
        //   time: "15:58 am",
        //   video: false,
        //   image:
        //     "https://lh3.googleusercontent.com/proxy/vHYCPBmIVeWlhoab4IM2xaUHRbzSkK859fTqG4FBAzmhjQVpuf020YiQQk1kYN1FZUOGgJipqjTcm6Vk75Q2edeCh2en9cDYlW5L81hT6-Ftu_dEUfrf25xkb_0BbfdEUgZyYDkF95k"
        // },
        {
          id: 3,
          name: "Jaden Boor",
          date: "12 aug",
          time: "12:45 am",
          // video: true,
          image: "https://img.icons8.com/plasticine/400/000000/delete-sign.png"
        },
        {
          id: 4,
          name: "Srick Tree",
          date: "12 feb",
          time: "08:32 am",
          video: false,
          image: "https://img.icons8.com/plasticine/400/000000/checked-2.png"
        },
        {
          id: 5,
          name: "John Doe",
          date: "12 oct",
          time: "07:45 am",
          video: true,
          image: "https://bootdey.com/img/Content/avatar/avatar3.png"
        },
        {
          id: 6,
          name: "John Doe",
          date: "12 jan",
          time: "09:54 am",
          video: false,
          image: "https://bootdey.com/img/Content/avatar/avatar2.png"
        },
        {
          id: 8,
          name: "John Doe",
          date: "12 jul",
          time: "11:22 am",
          video: true,
          image: "https://bootdey.com/img/Content/avatar/avatar1.png"
        },
        {
          id: 9,
          name: "John Doe",
          date: "12 aug",
          time: "13:33 am",
          video: false,
          image: "https://bootdey.com/img/Content/avatar/avatar4.png"
        },
        {
          id: 10,
          name: "John Doe",
          date: "12 oct",
          time: "11:58 am",
          video: true,
          image: "https://bootdey.com/img/Content/avatar/avatar7.png"
        },
        {
          id: 11,
          name: "John Doe",
          date: "12 jan",
          time: "09:28 am",
          video: false,
          image: "https://bootdey.com/img/Content/avatar/avatar1.png"
        }
      ]
    };
  }

  async componentDidMount() {
    var db = firebase.database();
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    let volLab = "";
    let partis = [];

    labFlag = await db
      .ref("lab/flag/")
      .once("value")
      .then(snapshot => {
        // console.log(snapshot.val());
        return snapshot.val();
      });
    // console.log(labFlag);
    if (labFlag === true) {
      volLab = await db
        .ref("volunteer/" + uid + "/Lab/")
        .once("value")
        .then(snapshot => {
          // console.log(snapshot.val());
          return snapshot.val();
        });
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
  }

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
        <Image
          style={[styles.icon, { marginRight: 0 }]}
          source={{ uri: callIcon }}
        />
      </View>
      // </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button
          icon="qrcode"
          mode="outlined"
          style={{
            marginHorizontal: Dimensions.get("window").width / 7,
            marginVertical: 10
            // backgroundColor: "#FF6501c5"
          }}
          onPress={() => this.props.navigation.navigate("AttendanceQR")}
        >
          Scan for attendance
        </Button>
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
