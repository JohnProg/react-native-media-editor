/* @flow */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
  Platform,
  ActivityIndicator,
  TextInput
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNMediaEditor from 'react-native-media-editor';


var options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

function toVerticalString(str) {
  let verStr = '';
  for (s of str) {
    verStr += s + '\n';
  }
  return verStr;
}

export default class example extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      photo: null,
      video: null,
      text: '',
      fontSize: 20,
      colorCode: '#ffffff',
      textBackgroundColor: '#fef000'
    };

    this.onButtonPress = this.onButtonPress.bind(this);
    this.onEmbedButtonPress = this.onEmbedButtonPress.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  onButtonPress() {
    this.setState({
      photo: null,
      loading: true
    });
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          const source = {uri: response.uri, isStatic: true};
        }

        this.setState({
          photo: source,
          loading: false,
        });
      }
    });
  }

  onEmbedButtonPress() {
    const {text, subText, photo, fontSize, colorCode, textBackgroundColor} = this.state;
    if (photo) {
      // RNMediaEditor.addTextToImage(toVerticalString(text), photo, fontSize, colorCode);
      RNMediaEditor.embedTextOnImage(text, photo, fontSize, colorCode, textBackgroundColor, 200, 20);
    }
  }

  renderImage() {
    if (this.state.photo) {
      return (
        <Image
          style={styles.image}
          source={this.state.photo}
        />
      )
    } else if (this.state.loading) {
      return <ActivityIndicator />;
    } else {
      return;
    }
  }

  renderInput() {
    return (
      <View>
        <View>
          <Text style={styles.labelText}>Text</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
        </View>
        <View>
          <Text>Font Size</Text>
          <TextInput
            style={styles.input}
            onChangeText={(fontSize) => this.setState({fontSize: Number(fontSize)})}
            keyboardType="number-pad"
            value={String(this.state.fontSize)}
          />
        </View>
        <View>
          <Text>Color</Text>
          <TextInput
            style={styles.input}
            onChangeText={(colorCode) => this.setState({colorCode})}
            value={this.state.colorCode}
          />
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View >
          <Button
            onPress={this.onButtonPress}
            title="Pick Image"
          />
          <Button
            onPress={this.onEmbedButtonPress}
            title="Embed Text"
          />
          { this.renderImage() }
        </View>
        { this.renderInput() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/2,
  },
  input: {
    height: 20,
    width: 200,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    borderRadius: 5,
    fontSize: 14,
    padding: 4,
  },
});

AppRegistry.registerComponent('example', () => example);
