import React, { Component } from "react";
import Login from "./src/login";
import Home from "./src/qrScannner";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons } from "@expo/vector-icons";
import AuthLoading from "./src/authLoading";
export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

const MainNavigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false
    }
  }
});

const RootNavigator = createSwitchNavigator({
  // AuthLoading: {
  //   screen: AuthLoading,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // Login: {
  //   screen: Login,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  MainNavigator: {
    screen: MainNavigator,
    navigationOptions: {
      headerShown: false
    }
  }
});

const AppContainer = createAppContainer(RootNavigator);
