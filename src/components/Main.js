import { createStackNavigator } from "react-navigation";
import React from 'react';
import Home from "./Home";
import Game from "./App";

export default class Main extends React.Component {
  render() {
    return <RootStack />;
  }
}

const RootStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: "LIGO"
    }
  },
  Game: {
    screen: Game,
    navigationOptions: {
      title: "PLAY"
    }
  }
},
{
  initialRouteName: 'Home',
});
