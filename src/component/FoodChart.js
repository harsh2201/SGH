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
    db.ref("log/Food/").on("value", snap => {
      this.setState({ snap: snap.val() }, this.analysis.bind(this));
    });
  }
  analysis = () => {
    const values = Object.values(this.state.snap);
    var breakfast = [];
    var lunch = [];
    var highTea = [];
    var dinner = [];
    var breakfast1 = [];
    var lunch1 = [];
    var breakfastTime = [8, 10];
    var lunchTime = [12, 15];
    var highTeaTime = [5, 6];
    var dinnerTime = [7, 10];
    var breakfast1Time = [8, 10];
    var lunch1Time = [12, 15];

    for (var i in values) {
      for (var j in Object.keys(values[i])) {
        var d = parseInt(Object.keys(values[i])[j]);
        d = d * 1000;
        var date = new Date(d);
        if (date.getDate() == 27) {
          // console.log(date.getHours());
          var dhours = date.getHours();
          console.log(date.getDate(), dhours);

          if (dhours > breakfastTime[0] && dhours < breakfastTime[1]) {
            breakfast.push(date);
          } else if (dhours > lunchTime[0] && dhours < lunchTime[1]) {
            lunch.push(date);
          } else if (dhours > highTeaTime[0] && dhours < highTeaTime[1]) {
            highTea.push(date);
          } else if (dhours > dinnerTime[0] && dhours < dinnerTime[1]) {
            dinner.push(date);
          }
        } else if (date.getDate() == 28) {
          var dhours = date.getHours();
          if (dhours > breakfast1Time[0] && dhours < breakfast1Time[1]) {
            breakfast1.push(date);
          } else if (dhours > lunch1Time[0] && dhours < lunch1Time[1]) {
            lunch1.push(date);
          }
        }
        // console.log(date.getDate());
      }
    }
    // this.setState(this.state.data.datasets[0][])
    console.log(
      breakfast.length,
      lunch.length,
      highTea.length,
      dinner.length,
      breakfast1.length,
      lunch1.length
    );
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
