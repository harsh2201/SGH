import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
const { width, height } = Dimensions.get("window");
import firebase from "../config";
const db = firebase.database();
const chartConfig = {
  backgroundGradientFrom: "#000",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#fff",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0, 0 , 0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5
};

class FoodChart extends Component {
  componentDidMount() {
    db.ref("/Dates").once("value", snapshot => {
      db.ref("log/Food/").on("value", snap => {
        this.setState({ snap: snap.val() }, () =>
          this.analysis(snapshot.val())
        );
      });
    });
  }
  analysis = snap => {
    // console.log(snap);a
    const values = Object.values(this.state.snap);
    var breakfast = [];
    var lunch = [];
    var highTea = [];
    var dinner = [];
    var breakfast1 = [];
    var lunch1 = [];
    // var breakfastTime = [8, 10];
    // var lunchTime = [12, 15];
    // var highTeaTime = [17, 18];
    // var dinnerTime = [19, 22];
    // var breakfast1Time = [8, 10];
    // var lunch1Time = [12, 15];
    // var day = [27, 28];
    var breakfastTime = snap.breakfastTime;
    var lunchTime = snap.lunchTime;
    var highTeaTime = snap.highTeaTime;
    var dinnerTime = snap.dinnerTime;
    var breakfast1Time = snap.breakfast1Time;
    var lunch1Time = snap.lunch1Time;
    var day = snap.day;
    console.log(breakfastTime, lunchTime);

    for (var i in values) {
      for (var j in Object.keys(values[i])) {
        var d = parseInt(Object.keys(values[i])[j]);
        d = d * 1000;
        var date = new Date(d);
        if (date.getDate() === day[0]) {
          var dhours = date.getHours();
          // console.log(date.getDate(), dhours);

          if (dhours >= breakfastTime[0] && dhours <= breakfastTime[1]) {
            breakfast.push(date);
          } else if (dhours >= lunchTime[0] && dhours <= lunchTime[1]) {
            lunch.push(date);
          } else if (dhours >= highTeaTime[0] && dhours <= highTeaTime[1]) {
            highTea.push(date);
          } else if (dhours >= dinnerTime[0] && dhours <= dinnerTime[1]) {
            dinner.push(date);
          }
        } else if (date.getDate() === day[1]) {
          // console.log(28, date.getHours());
          var dhours = date.getHours();
          if (dhours > breakfast1Time[0] && dhours < breakfast1Time[1]) {
            breakfast1.push(date);
          } else if (dhours > lunch1Time[0] && dhours < lunch1Time[1]) {
            lunch1.push(date);
          }
        }
      }
    }
    console.log(
      breakfast.length,
      lunch.length,
      highTea.length,
      dinner.length,
      breakfast1.length,
      lunch1.length
    );
    this.setState({
      data: {
        labels: [
          "Breakfast",
          "Lunch",
          "High Tea",
          "Dinner",
          "Breakfast",
          "lunch"
        ],
        datasets: [
          {
            data: [
              breakfast.length,
              lunch.length,
              highTea.length,
              dinner.length,
              breakfast1.length,
              lunch1.length
            ],
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
          }
        ]
      }
    });
  };
  constructor() {
    super();
    this.state = {
      snap: {},
      data: {
        labels: [
          "Breakfast",
          "Lunch",
          "High Tea",
          "Dinner",
          "Breakfast",
          "lunch"
        ],
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0],
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
          }
        ]
      }
    };
  }
  render() {
    return (
      <View>
        <LineChart
          data={this.state.data}
          width={width}
          height={256}
          verticalLabelRotation={30}
          chartConfig={chartConfig}
          bezier
        />
      </View>
    );
  }
}
export default FoodChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
