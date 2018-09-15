import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import Option from './Option';
import shuffle from 'lodash.shuffle';
import AwesomeAlert from 'react-native-awesome-alerts';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

class Game extends React.Component {
  static propTypes = {
    gameOptions : PropTypes.number.isRequired,
    time : PropTypes.number.isRequired,
    update : PropTypes.func.isRequired,
    difficulty : PropTypes.number.isRequired,
    level : PropTypes.number.isRequired,
    zone : PropTypes.number.isRequired,
    lives : PropTypes.number.isRequired,
  };

  state = {
    optionsSelected : [],
    remTime : this.props.time,
    showAlert : false,
  };
  status = 'PLAYING';
  randomOptions = Array.from({length : this.props.gameOptions})
    .map(() => 1 + Math.floor(this.props.difficulty * Math.random()));
  target = this.randomOptions
    .slice(0,this.props.gameOptions - 2)
    .reduce((acc, cur) => acc + cur , 0);

  options = shuffle(this.randomOptions);

  componentDidMount() {
    console.log('Diff:'+this.props.difficulty);
    this.timerId = setInterval(()=>{
      this.setState((prevState) => {
        return { remTime : prevState.remTime - 1 };
      }, ()=> {
        if(this.state.remTime === 0){
          clearInterval(this.timerId);
        }
      });
    }, 1000);
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.state.optionsSelected !== nextState.optionsSelected || nextState.remTime === 0){
      this.status = this.calGameStatus(nextState);
    }
  }

  isOptionSelected = (index) => {
    return this.state.optionsSelected.indexOf(index) >= 0 ;
  };

  markSelected = (index) => {
    this.setState((prevState) => ({
      optionsSelected : [...prevState.optionsSelected, index]
    }));
  };

  calGameStatus = (nextState) => {
    if(nextState.remTime === 0){
      clearInterval(this.timerId);
      return 'LOST';
    }
    const sum = nextState.optionsSelected.reduce((acc, cur) => {
      return acc + this.options[cur];
    }, 0);
    if(sum < this.target){
      return 'PLAYING';
    }

    if(sum === this.target){
      clearInterval(this.timerId);
      return 'WON';
    }

    if(sum > this.target){
      clearInterval(this.timerId);
      return 'LOST';
    }
  };

  getWinningMsg = () => {
    if(this.props.zone === 5){
      return 'Oye Hoye! \nYou have Crossed this Level!';
    }
    else {
      return 'Balle Balle! \nYou cracked this code!';
    }
  };

  getLostMsg = () => {
    if(this.props.lives === 1){
      return 'Ohh! No!\nYou lost the series!';
    } else{
      return 'Ohh! \nYou lost this one! Try another one!';
    }
  };

  getTimeOutMsg = () => {
    return 'Abbe! Time out! \nYou can Try Again!';
  };


  reset = () => {
    this.props.update(this.status === 'WON' ? true : false);
  };

  render() {
    return (
      <View style = {styles.container}>
        <Text style={[styles.target, styles[`STATUS_${this.status}`]]}>{this.target}</Text>
        <Text style={styles.timer}>{this.state.remTime}</Text>
        <Text style={styles.lives}>{'Lives : ' + this.props.lives}</Text>
        <View style = {styles.optionsContainer}>
          {this.options
            .map((number, index) =>
              <Option
                key = {index}
                id = {index}
                value = {number}
                isDisabled = { this.isOptionSelected(index) || this.status != 'PLAYING' }
                onPress = {this.markSelected}
              />
            )}
        </View>
        <View style = {styles.reset}>
          <Text style={styles.level}>{'Level '+this.props.level+'-'+this.props.zone}</Text>
          <Text style = {styles.hint}>{'Crack the code using different combinations!'}</Text>
        </View>
        <AwesomeAlert
          show={this.state.remTime === 0 ? true : false}
          showProgress={false}
          message={this.getTimeOutMsg()}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={false}
          cancelText="Try Again!"
          messageStyle = {styles.alertMsg}
          cancelButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.reset();
          }}
        />

        <AwesomeAlert
          show={this.status === 'WON' ? true : false}
          showProgress={false}
          message={this.getWinningMsg()}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          messageStyle = {styles.alertMsg}
          showConfirmButton={false}
          cancelText='Move to Next!'
          cancelButtonColor="#03DEC6"
          onCancelPressed={() => {
            this.reset();
          }}
        />

        <AwesomeAlert
          show={this.status === 'LOST' && this.state.remTime > 0 ? true : false}
          showProgress={false}
          message={this.getLostMsg()}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          messageStyle = {styles.alertMsg}
          showConfirmButton={false}
          cancelText="Try Another"
          cancelButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.reset();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor : '#ddd',
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  target : {
    fontSize : 45,
    backgroundColor : '#fff',
    textAlign : 'center',
    marginHorizontal : 50,
    marginTop : 30,
    width : 200,
  },

  alertMsg : {
    textAlign : 'center',
  },

  timer : {
    fontSize : 30,
    backgroundColor : '#fff',
    textAlign : 'center',
    width : 60,
    borderRadius : 20,
    borderColor: '#fff',
    color : 'orange',
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal : 50,
    marginTop : 30,
  },
  hint : {
    flexWrap : 'wrap',
  },
  lives : {
    fontSize : 25,
    backgroundColor : '#fff',
    textAlign : 'center',
    width : 300,
    borderRadius : 50,
    borderColor: '#fff',
    color : 'green',
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal : 50,
    marginTop : 20,
  },
  level : {
    fontSize : 25,
    color : 'blue',
    textAlign : 'center',
    margin : 10,
  },
  reset : {
    flex : 1,
  },
  optionsContainer : {
    flex : 2,
    marginTop : 20,
    flexDirection : 'row',
    flexWrap : 'wrap',
    justifyContent : 'space-around',
  },
  STATUS_PLAYING : {
    backgroundColor : '#fff',
  },
  STATUS_WON : {
    backgroundColor : '#03DEC6',
  },
  STATUS_LOST : {
    backgroundColor : '#DD6B55',
  }
});

export default Game;
