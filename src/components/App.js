import React from 'react';
import Game from './Game';

class App extends React.Component {
  state = {
    gameId : 1,
    time : 10,
    difficulty : 5,
    level : 1,
    zone : 1,
    options : 6,
    lives : 3,
  };

  updateGame = (won) => {
      if(won){
        this.goNext()
      } else{
        if(this.state.lives === 1 ){
          this.props.navigation.navigate('Home');
        }
        else
          this.restart();
      }
  };

  goNext = () => {
    this.setState((prevState) => {
      return {
        gameId : prevState.gameId + 1,
        level : prevState.zone === 5 ? prevState.level + 1 : prevState.level,
        time : prevState.zone === 5 ? prevState.time + 3 : prevState.time,
        lives : prevState.zone === 5 ? prevState.lives + 1 : prevState.lives,
        difficulty : prevState.zone === 5 ? prevState.difficulty + 3 : prevState.difficulty,
        zone : prevState.zone === 5 ? 1 : prevState.zone + 1,
      }
    });
  }

  reset = () => {
    this.setState((prevState) => {
      return {
        gameId : prevState.gameId + 1,
        level : 1,
        time : 10,
        zone : 1,
        difficulty : 5,
        lives : 3,
      }
    });
  }

  restart = () => {
    this.setState((prevState) => {
        return {
          gameId : prevState.gameId + 1,
          lives : prevState.lives - 1,
        }
    });
  }


  render() {
    return (
      <Game
        key = {this.state.gameId}
        update = {this.updateGame}
        gameOptions = {this.state.options}
        time = {this.state.time}
        difficulty = {this.state.difficulty}
        level = {this.state.level}
        zone = {this.state.zone}
        lives = {this.state.lives}
      />
    );
  }
}

export default App;
