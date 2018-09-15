import React from 'react';
import renderIf from './renderIf';
import {View, AsyncStorage, Text, TextInput, Button, StyleSheet} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

class Home extends React.Component {
  state = {
    text : '',
    username: '',
  }

  play = () => {
    if(this.state.username){
      this.props.navigation.navigate('Game');
    } else if(this.state.text.length >2){
      try {
        AsyncStorage.setItem('@OGIL:username', this.state.text);
        this.props.navigation.navigate('Game');
      } catch (error) {
        console.log('Error!');
      }
    } else {
      this.refs.toast.show('Enter Valid Name!');
    }
  };

  async check(){
    try {
      let value = await AsyncStorage.getItem('@OGIL:username');
      if(value !== null ){
        const username = value;
        this.setState({username});
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    this.check();
    return (
      <View style={styles.container}>
        {renderIf(this.state.username)(
          <Text style={styles.input}>{'Welcome '+this.state.username}</Text>
        )}
        {renderIf(!this.state.username)(
          <TextInput
            style={styles.input}
            placeholder = {'Enter Your Name!'}
            onChangeText={(text) => this.setState({text})}
          />
        )}
        <Button
          title = { 'Start Game'}
          color = "red"
          onPress = {this.play} >
        </Button>
        <Text style={styles.hint}>{"Hello Hacker! \nYou will be given a code, you need to crack it using different combinations! \n\nAfter each attempt difficulty will increase! \n\nYou have 3 lives, after each level one life will be awarded as gift!"}</Text>
        <Toast ref="toast"/>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container : {
    backgroundColor : '#ddd',
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input : {
    fontSize : 40,
    margin : 10,
    width : '100%',
    textAlign : 'center',
    flexDirection : 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint : {
    fontSize : 18,
    margin : 20,
    flexDirection : 'row',
    justifyContent: 'center',
    textAlign : 'center',
    alignItems: 'center',
  },
});

export default Home;
