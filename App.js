import React, { Component } from "react";
import Login from "./src/login";
import Home from "./src/qrScannner";
import Analytics from "./src/Analytics";
import Main from "./src/Main";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons } from "@expo/vector-icons";
import AuthLoading from "./src/authLoading";
import config from "./src/config";
import Labinfo from "./src/Labinfo";
export default class App extends Component {
  render() {
    console.disableYellowBox = true;
    return <AppContainer />;
  }
}

const MainNavigator = createStackNavigator({
  Main: {
    screen: Main,
    navigationOptions: {
      headerShown: false
    }
  },
  Analytics: {
    screen: Analytics,
    navigationOptions: {
      headerShown: false
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false
    }
  },
  Labinfo: {
    screen: Labinfo,
    navigationOptions: {
      headerShown: false
    }
  }
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
