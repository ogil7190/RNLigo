import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

class Option extends React.Component {
  static propTypes = {
    id : PropTypes.number.isRequired,
    value : PropTypes.number.isRequired,
    isDisabled  : PropTypes.bool.isRequired,
    onPress : PropTypes.func.isRequired,
  };
  clickHandler = () => {
    if(this.props.isDisabled) { return;}
    this.props.onPress(this.props.id);
  };
  render() {
    return (
      <TouchableOpacity onPress = {this.clickHandler}>
        <Text style = {[styles.option, this.props.isDisabled  && styles.selected]} > {this.props.value} </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  option : {
    backgroundColor : '#fff',
    width : 100,
    margin : 10,
    textAlign : 'center',
    fontSize : 40,
    marginHorizontal : 25,
  },
  selected : {
    opacity : 0.4,
  }
});

export default Option;
