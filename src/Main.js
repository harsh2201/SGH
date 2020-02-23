import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import firebase from "./config";
import Spinner from "react-native-loading-spinner-overlay";

var { height, width } = Dimensions.get("window");

export default class Menu extends Component {
  static navigationOptions = {
    title: "Menu   "
  };
  constructor(props) {
    super(props);
    this.state = {
      visibility: true,
      data: [
        {
          id: 0,
          title: "Lab Attendance",
          color: "#FF4500",
          image: "https://img.icons8.com/color/70/000000/name.png"
        },

        {
          id: 1,
          title: "Lab Attendance Analysis",
          color: "#4682B4",
          image: "https://img.icons8.com/color/70/000000/two-hearts.png"
        },
        {
          id: 2,
          title: "Food Scan",
          color: "#87CEEB",
          image: "https://img.icons8.com/office/70/000000/home-page.png"
        },
        {
          id: 3,
          title: "Food Analysis",
          color: "#6A5ACD",
          image: "https://img.icons8.com/color/70/000000/family.png"
        },
        {
          id: 4,
          title: "Sign Out",
          color: "red",
          image: "https://img.icons8.com/color/70/000000/family.png"
        }
      ]
    };
  }
  // lab volun LV - attendance index - 0
  // food volun FV - food scan index - 2
  // food coor FC - food scan and food analysis + switch + past log index - 2, 3
  // studen coor SC - lab analysis switch and past log index - 1
  // admin A - analysis + fc + sc - switch - scan index - 1 without switch,3 without switch
  componentDidMount() {
    var user = firebase.auth().currentUser;
    try {
      firebase
        .database()
        .ref("volunteer/" + user.uid)
        .once("value")
        .then(dataSnapshot => {
          // var access = dataSnapshot.val().Access;
          access = ["SC", "LV", "FC"];
          var temp = [];
          access.forEach(access => {
            if (access === "SC") {
              if (!temp.includes(this.state.data[1])) {
                temp.push(this.state.data[1]);
              }
            }
            if (access === "LV") {
              if (!temp.includes(this.state.data[0])) {
                temp.push(this.state.data[0]);
              }
            }
            if (access === "FC") {
              if (!temp.includes(this.state.data[2])) {
                temp.push(this.state.data[2]);
              }
              if (!temp.includes(this.state.data[3])) {
                temp.push(this.state.data[3]);
              }
            }
            if (access === "A") {
              if (!temp.includes(this.state.data[1])) {
                temp.push(this.state.data[1]);
              }
              if (!temp.includes(this.state.data[3])) {
                temp.push(this.state.data[3]);
              }
            }
            if (access === "FV") {
              if (!temp.includes(this.state.data[2])) {
                temp.push(this.state.data[2]);
              }
            }
          });
          temp.push(this.state.data[4]);
          this.setState({ data: temp, visibility: false });
        });
    } catch (e) {
      alert(e);
    }
  }

  async naigationHandler(id) {
    if (id == 0) {
      this.props.navigation.navigate("LabAttendance");
    } else if (id == 1) {
      this.props.navigation.navigate("LabAnalysis");
    } else if (id == 2) {
      this.props.navigation.navigate("FoodScan");
    } else if (id == 3) {
      this.props.navigation.navigate("FoodAnalysis");
    } else if (id == 4) {
      await firebase.auth().signOut();
    } else {
      alert("None found !!");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.visibility}
          textContent={"Loading..."}
          textStyle={{
            color: "#FFF"
          }}
          overlayColor="rgba(0, 0, 0, 1)"
        />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={this.state.data}
          horizontal={false}
          keyExtractor={item => {
            return String(item.id);
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                key={String(item.id)}
                style={[styles.card, { backgroundColor: item.color }]}
                onPress={() => {
                  this.naigationHandler(item.id);
                }}
              >
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // marginTop: 20
  },
  list: {
    paddingHorizontal: 10,
    backgroundColor: "#E6E6E6"
  },

  /******** card **************/
  card: {
    width: "100%",
    height: 150,
    flexDirection: "row",
    padding: 20,
    marginVertical: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10
  },
  cardImage: {
    // height: 70,
    // width: 70
  },
  title: {
    fontSize: 28,
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 40
  },
  subTitle: {
    fontSize: 12,
    flex: 1,
    color: "#FFFFFF"
  },
  icon: {
    height: 20,
    width: 20
  }
});
