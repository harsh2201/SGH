import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image
} from "react-native";
import firebase from "./config";
import Spinner from "react-native-loading-spinner-overlay";

export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      visibility: false
    };
  }

  _signIn = async () => {
    try {
      this.setState({ visibility: true });
      if (this.state.email === "" || this.state.password === "") {
        alert("Email or password is empty !!");
        this.setState({ visibility: false });
        return;
      }
      await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch(e => {
          alert(e);
        });
      this.setState({ visibility: false });
    } catch (e) {
      alert(e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.visibility}
          textContent={"Loading..."}
          textStyle={{
            color: "#FFF"
          }}
          overlayColor="rgba(0, 0, 0, 0.8)"
        />
        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={{
              uri: "https://png.icons8.com/message/ultraviolet/50/3498db"
            }}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            onChangeText={email => this.setState({ email })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={{
              uri: "https://png.icons8.com/key-2/ultraviolet/50/3498db"
            }}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            onChangeText={password => this.setState({ password })}
          />
        </View>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this._signIn()}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={async () => {
            try {
              await firebase.auth().sendPasswordResetEmail(this.state.email);
              alert("Email has been sent !!");
            } catch (e) {
              alert(e);
            }
          }}
        >
          <Text style={styles.loginText}>Forgot your password?</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6A5ACD"
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center"
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30
  },
  loginButton: {
    backgroundColor: "#00b5ec"
  },
  loginText: {
    color: "white"
  }
});
