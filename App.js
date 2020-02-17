import React, { Component } from "react";
import Login from "./screens/login";
import Dashboard from "./screens/dashboard";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons } from "@expo/vector-icons";
import AuthLoading from "./screens/authLoading";
export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

const MainNavigator = createStackNavigator({
  Home: Home
});

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
