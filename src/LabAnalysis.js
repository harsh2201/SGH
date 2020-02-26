import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Picker,
  Image,
  Linking,
  Alert
} from "react-native";
import firebase from "./config";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  Switch,
  Button,
  Modal,
  Portal,
  Provider,
  Dialog,
  Paragraph
} from "react-native-paper";

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      labAttendance: [],
      // labObj: {},
      switch: false,
      visible: false
    };
  }

  async componentDidMount() {
    var db = firebase.database();
    var data = {};
    var labAttendance = [];
    var jsonData = {};
    var labWiseVol = {};
    var jsonVol = {};

    await db
      .ref("volunteer/")
      .once("value")
      .then(snap => {
        // console.log(snap.val());
        jsonVol = snap.val();
        labWiseVol = {};
        for (var item in jsonVol) {
          // labWiseVol[item]
          labWiseVol[jsonVol[item]["Lab"]] = jsonVol[item];
          // console.log(item.Lab);
        }
        this.setState({ labWiseVol: labWiseVol });
      });

    // console.log(labWiseVol);

    db.ref("lab/").on("value", snap => {
      // console.log("Entered", snap.val());
      data = {};
      labAttendance = [];
      jsonData = snap.val();
      // this.setState({  });

      this.setState({
        // labObj: jsonData,
        // labAttendance: [],
        switch: jsonData["flag"]
      });
      // if (jsonData["flag"] !== undefined) {
      //   console.log("Exists");
      // }
      delete jsonData["flag"];

      for (var lab in jsonData) {
        if (lab !== "lab" || lab !== "flag") {
          data[lab] = {};
          data[lab]["present"] = 0;
          data[lab]["call"] = this.state.labWiseVol[lab]["Mobile"];
          data[lab]["Name"] =
            this.state.labWiseVol[lab]["Incharge"] +
            " - " +
            this.state.labWiseVol[lab]["Email"];
          data[lab]["total"] = 0;
          for (var part in jsonData[lab]) {
            if (jsonData[lab][part]["taken"] === true) {
              data[lab]["present"] += 1;
              // console.log(this.state.labWiseVol[lab]);
            }
            data[lab]["total"] += 1;
          }
        }
      }
      for (var x in data) {
        if (x !== "flag" || x !== "lab") {
          data[x]["lab"] = x;
          labAttendance.push(data[x]);
          // console.log(data[x]["call"]);
        }
      }
      this.setState({
        labAttendance: labAttendance,
        isLoading: false
      });
    });
  }

  _handleCall = item => {
    // console.log(item);
    var url = `tel:${item.call}`;
    this.setState({ currMobile: url });
    Alert.alert(
      "Attention",
      "Call " + item.Name + " ?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Okay",
          onPress: () => {
            Linking.canOpenURL(this.state.currMobile).then(supported => {
              if (supported) {
                return Linking.openURL(this.state.currMobile).catch(() => null);
              }
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  renderItem = item => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("GlobalLabAttendance", {
            lab: item.lab
          });
        }}
      >
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
      </TouchableOpacity>
    );
  };

  resetAttendance = async () => {
    var db = firebase.database();
    this.setState({ isLoading: true });
    if (this.state.switch === false) {
      await db
        .ref("lab/")
        .once("value", async resetSnap => {
          var jsonData = resetSnap.val();
          delete jsonData["flag"];

          for (var lab in jsonData) {
            for (var part in jsonData[lab]) {
              if (part !== undefined) {
                // console.log(jsonData[lab][part]);
                jsonData[lab][part]["taken"] = false;
              }
              // console.log(part);
            }
          }
          // console.log(jsonData);
          db.ref("lab/").update(jsonData);
        })
        .catch(e => {
          this.setState({ isLoading: false });
          alert(e);
        });
      this.setState({ isLoading: false });
    } else if (this.state.switch === true) {
      var absent = {};
      await db
        .ref("lab/")
        .once("value", async resetSnap => {
          var jsonData = resetSnap.val();
          delete jsonData["flag"];

          for (var lab in jsonData) {
            for (var part in jsonData[lab]) {
              if (part !== undefined) {
                // console.log(jsonData[lab][part]);
                if (jsonData[lab][part]["taken"] === false) {
                  console.log(jsonData[lab][part]);
                  db.ref(
                    "AbsentList/" +
                      "/" +
                      jsonData[lab][part]["suid"] +
                      "/" +
                      Date.now()
                  ).update(jsonData[lab][part]);
                }
                // jsonData[lab][part]["taken"] = false;
              }
              // console.log(part);
            }
          }
          // console.log(jsonData);
          // db.ref("lab/").update(jsonData);
        })
        .catch(e => {
          alert(e);
        });
    }
    try {
      await db.ref("lab/flag/").set(!this.state.switch);
    } catch (e) {
      this.setState({ isLoading: false });
      alert(e);
    }
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
          <View style={{ flex: 1 }}>
            {/* <View style={{}}>
              <Picker
                selectedValue={this.state.language}
                style={{
                  height: 50,
                  // width: 100,
                  justifyContent: "center",
                  alignItems: "center"
                  // backgroundColor: "#000"
                }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ language: itemValue })
                }
              >
                <Picker.Item label="Day 1 - 1st Attendance" value="day00" />
                <Picker.Item label="Day 1 - 2nd Attendance" value="day01" />
                <Picker.Item label="Day 1 - 3rd Attendance" value="day02" />
                <Picker.Item label="Day 2 - 1st Attendance" value="day10" />
                <Picker.Item label="Day 2 - 2nd Attendance" value="day11" />
              </Picker>
            </View>   */}

            {firebase.auth().currentUser.email === "17ce039@charusat.edu.in" ? (
              <View
                style={{
                  justifyContent: "center",
                  alignSelf: "center",
                  marginTop: 20,
                  flexDirection: "row"
                }}
              >
                <Text style={{ marginRight: 3 }}>{"Attendance ON/OFF"}</Text>
                <Switch
                  value={this.state.switch}
                  onValueChange={() => {
                    this.resetAttendance();
                  }}
                />
              </View>
            ) : null}

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
                  <View key={String(item.lab)}>
                  <TouchableOpacity
                    style={[styles.card]}
                    onPress={() => {
                      this.props.navigation.navigate("GlobalLabAttendance", {
                        lab: item.lab
                      });
                    }}
                  >
                    <Text style={styles.title}>{item.lab}</Text>
                    <AnimatedCircularProgress
                      size={70}
                      width={10}
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
                    <TouchableOpacity
                      onPress={() => {
                        this._handleCall(item);
                      }}
                    >
                      <Image
                        style={[styles.icon]}
                        source={{
                          uri:
                            "https://img.icons8.com/doodle/240/000000/phone--v1.png"
                        }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
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
    height: 50,
    width: 50,
    marginHorizontal: 5
  }
});
