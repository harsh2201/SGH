import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class login extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>login</Text>
            </View>
        );
    }
}
export default login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});