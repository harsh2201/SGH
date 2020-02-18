import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class Analytics extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Analytics</Text>
            </View>
        );
    }
}
export default Analytics;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});