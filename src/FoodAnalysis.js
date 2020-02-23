import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class FoodAnalysis extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>FoodAnalysis</Text>
      </View>
    );
  }
}
export default FoodAnalysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
