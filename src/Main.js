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
import firebase from "./config";
import Spinner from "react-native-loading-spinner-overlay";

var { height, width } = Dimensions.get("window");
// lab volun LV - attendance index - 0
// food volun FV - food scan index - 2
// food coor FC - food scan and food analysis + switch + past log index - 2, 3
// studen coor SC - lab analysis switch and past log index - 1
// admin A - analysis + fc + sc - switch - scan index - 1 without switch,3 without switch

export default class Menu extends Component {
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
        }
      ]
    };
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    var temp;
    firebase
      .database()
      .ref("volunteer/vuid1/")
      .once("value")
      .then(data => {
        temp = data.val().access;
      });
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
          overlayColor="rgba(0, 0, 0, 0.8)"
        />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={this.state.data}
          horizontal={false}
          keyExtractor={item => {
            return item.id;
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: item.color }]}
                onPress={() => {}}
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
    flex: 1,
    marginTop: 20
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor: "#E6E6E6"
  },

  /******** card **************/
  card: {
    width: width,
    height: 150,
    flexDirection: "row",
    padding: 20,

    justifyContent: "center",
    alignItems: "center"
  },
  cardImage: {
    height: 70,
    width: 70
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
