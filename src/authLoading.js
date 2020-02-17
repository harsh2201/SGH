import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class authLoading extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>authLoading</Text>
            </View>
        );
    }
}
export default authLoading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});