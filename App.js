import React, { Component } from "react";
// import { View, StatusBar } from "react-native";
import Login from "./src/login";
import FoodAnalysis from "./src/FoodAnalysis";
import Main from "./src/Main";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
// import { Ionicons } from "@expo/vector-icons";
import AuthLoading from "./src/authLoading";
// import config from "./src/config";
import LabAnalysis from "./src/LabAnalysis";
import FoodScan from "./src/FoodScan";
import LabAttendance from "./src/LabAttendance";
import AttendanceQR from "./src/AttendanceQR";
// import { Constants } from "expo";

export default class App extends Component {
  render() {
    // console.disableYellowBox = true;
    // console.log(Constants.statusBarHeight);
    return <AppContainer />;
  }
}

const MainNavigator = createStackNavigator(
  {
    Main: {
      screen: Main,
      navigationOptions: {
        headerShown: true
      }
    },
    FoodAnalysis: {
      screen: FoodAnalysis,
      navigationOptions: {
        headerShown: true
      }
    },
    LabAnalysis: {
      screen: LabAnalysis,
      navigationOptions: {
        headerShown: true
      }
    },
    FoodScan: {
      screen: FoodScan,
      navigationOptions: {
        headerShown: true
      }
    },
    LabAttendance: {
      screen: LabAttendance,
      navigationOptions: {
        headerShown: true
      }
    },
    AttendanceQR: {
      screen: AttendanceQR,
      navigationOptions: {
        headerShown: true
      }
    }
  },
  { initialRouteName: "FoodAnalysis" }
);

const RootNavigator = createSwitchNavigator({
  AuthLoading: {
    screen: AuthLoading,
    navigationOptions: {
      headerShown: false
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false
    }
  },
  MainNavigator: {
    screen: MainNavigator,
    navigationOptions: {
      headerShown: false
    }
  }
});

const AppContainer = createAppContainer(RootNavigator);
