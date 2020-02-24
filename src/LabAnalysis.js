import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from "react-native";
import firebase from "./config";
import Spinner from "react-native-loading-spinner-overlay";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Switch } from "react-native-paper";

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      labAttendance: [],
      labObj: {},
      switch: false
    };
  }

  async componentDidMount() {
    db = firebase.database();

    // db.ref("lab/flag/").on("value", labSnap => {
    //   let flag = labSnap.val();
    //   this.setState({ switch: flag });
    // });
    labRef = await db.ref("lab/").on("value", snap => {
      let data = {};
      let labAttendance = [];
      let jsonData = snap.val();
      // this.setState({  });

      this.setState({
        labObj: jsonData,
        labAttendance: [],
        switch: jsonData["flag"]
      });
      delete jsonData["flag"];

      for (lab in this.state.labObj) {
        if (lab !== "lab" || lab !== "flag") {
          data[lab] = {};
          data[lab]["present"] = 0;
          data[lab]["total"] = 0;
          for (part in this.state.labObj[lab]) {
            if (this.state.labObj[lab][part]["taken"] === true) {
              data[lab]["present"] += 1;
            }
            data[lab]["total"] += 1;
          }
        }
      }
      for (x in data) {
        if (x !== "flag" || x !== "lab") {
          data[x]["lab"] = x;
          labAttendance.push(data[x]);
        }
      }
      this.setState({
        labAttendance: labAttendance,
        isLoading: false
      });
    });
  }

  renderItem = item => {
    return (
      <View key={String(item.lab)} style={[styles.card]}>
        <Text style={styles.title}>{item.lab}</Text>
        <AnimatedCircularProgress
          size={30}
          width={3}
          fill={item.present / item.total}
          tintColor="#00e0ff"
          backgroundColor="#3d5875"
        >
          {fill => <Text>{item.present}</Text>}
        </AnimatedCircularProgress>
      </View>
    );
  };

  resetAttendance = async () => {
    let db = firebase.database();
    this.setState({ isLoading: true });
    if (this.state.switch === false) {
      await db.ref("lab/").once("value", async resetSnap => {
        let jsonData = resetSnap.val();
        delete jsonData["flag"];

        for (lab in jsonData) {
          for (part in jsonData[lab]) {
            if (part !== undefined) {
              // console.log(jsonData[lab][part]);
              jsonData[lab][part]["taken"] = true;
              // db.ref("lab/" + lab + "/" + part + "/").update({
              //   taken: false
              // });
              // setTimeout(() => {
              //   let db = firebase.database();

              // }, 5);
            }
            // console.log(part);
          }
        }
        console.log(jsonData);
        db.ref("lab/").update(jsonData);
      });
      this.setState({ isLoading: false });
    }
    await db.ref("lab/flag/").set(!this.state.switch);
  };

  render() {
    const a = 2;
    return (
      <View style={styles.container}>
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
        ) : (
          <View>
            <View
              style={{
                justifyContent: "center",
                alignSelf: "center",
                marginTop: 20,
                flexDirection: "row"
              }}
            >
              <Text style={{ marginRight: 3 }}>Turn OFF Attendance</Text>
              <Switch
                value={this.state.switch}
                onValueChange={() => {
                  this.resetAttendance();
                  // this.setState({ isSwitchOn: !false });
                }}
              />
            </View>

            <FlatList
              style={styles.list}
              contentContainerStyle={styles.listContainer}
              data={this.state.labAttendance}
              horizontal={false}
              keyExtractor={item => {
                return String(item.lab);
              }}
              renderItem={({ item }) => {
                return (
                  <View key={String(item.lab)} style={[styles.card]}>
                    <Text style={styles.title}>{item.lab}</Text>
                    <AnimatedCircularProgress
                      size={70}
                      width={10}
                      // fill={100}
                      fill={(100 * item.present) / item.total}
                      tintColor="#00e0ff"
                      backgroundColor="#3d5875"
                    >
                      {fill => (
                        <Text>
                          {item.present} / {item.total}
                        </Text>
                      )}
                    </AnimatedCircularProgress>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6E6"
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
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  cardImage: {
    // height: 70,
    // width: 70
  },
  title: {
    fontSize: 28,
    flex: 1,
    color: "#1d1d1d",
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
