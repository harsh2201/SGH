import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class mainScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>mainScreen</Text>
            </View>
        );
    }
}
export default mainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});