import React, {Component} from 'react';
import {StyleSheet, Dimensions, StatusBar} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';

import Circle from '../components/Circle';

const {height, width} = Dimensions.get('screen');
const windowHeight = Dimensions.get('window').height;
const navbarHeight = height - windowHeight + StatusBar.currentHeight;

const BALL_SIZE = 20;

// const mid_point = width / 2 - BALL_SIZE / 2;

const ballSettings = {
  isStatic: true,
};

const ball = Matter.Bodies.circle(18, 18, BALL_SIZE, {
  ...ballSettings,
  label: 'ball',
});

setUpdateIntervalForType(SensorTypes.accelerometer, 30); //15

export default class App extends Component {
  state = {
    x: 18, // the ball's initial X position
    y: 18, // the ball's initial Y position
    isGameReady: false, // game is not ready by default
  };

  constructor(props) {
    super(props);

    const {engine, world} = this.addObjectsToWorld(ball);
    this.entities = this.getEntities(engine, world, ball);
    //
    this.physics = (entities, {time}) => {
      let engine = entities.physics.engine; // get the reference to the physics engine
      engine.world.gravity.y = 1; //0.5 // set the gravity of Y axis
      Matter.Engine.update(engine, time.delta); // move the game forward in time
      return entities;
    };
  }

  componentDidMount() {
    // handle object position
    accelerometer.subscribe(({x, y}) => {
      Matter.Body.setPosition(ball, {
        x: this.state.x + x,
        y: this.state.y + y,
      });

      this.setState(
        state => ({
          x: x + state.x,
          y: y + state.y,
        }), // to set boundary
        () => {
          if (
            this.state.x < 18 ||
            // this.state.x > width ||
            this.state.y < 18 ||
            // this.state.y > height ||
            this.state.x > width - 60 ||
            this.state.y > height - navbarHeight - 60
          ) {
            Matter.Body.setPosition(ball, {
              x: this.state.x - x,
              y: this.state.y - y,
            });

            this.setState({
              x: this.state.x - x,
              y: this.state.y - y,
            });
          }
        },
      );
    });

    this.setState({
      isGameReady: true,
    });
  }

  // componentWillUnmount() {
  //   accelerometer.stop();
  // }

  // add object to world
  addObjectsToWorld = ball => {
    const engine = Matter.Engine.create({enableSleeping: false});
    const world = engine.world;

    let objects = [ball];

    Matter.World.add(world, objects);
    return {
      engine,
      world,
    };
  };

  // to render moving object
  getEntities = (engine, world, ball) => {
    const entities = {
      physics: {
        engine,
        world,
      },

      playerBall: {
        body: ball,
        size: [BALL_SIZE, BALL_SIZE],
        renderer: Circle,
      },
    };

    return entities;
  };

  render() {
    const {isGameReady} = this.state;

    if (isGameReady) {
      return (
        <GameEngine
          style={styles.container}
          systems={[this.physics]}
          entities={this.entities}
        />
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    borderWidth: 1,
    backgroundColor: '#F5FCFF',
  },
});
