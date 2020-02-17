import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class onOff extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>onOff</Text>
      </View>
    );
  }
}
export default onOff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
