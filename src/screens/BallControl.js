import React, {Component} from 'react';
import {StyleSheet, Dimensions } from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';

import Circle from '../components/Circle';

const {height, width} = Dimensions.get('window');

const BALL_SIZE = 20;

const mid_point = width / 2 - BALL_SIZE / 2;

const ballSettings = {
  isStatic: true,
};

const ball = Matter.Bodies.circle(0, 0, BALL_SIZE, {
  ...ballSettings,
  label: 'ball',
});

const floor = Matter.Bodies.rectangle(width / 2, height, width, 10, {
  isStatic: true,
  isSensor: true,
  label: 'floor',
});

setUpdateIntervalForType(SensorTypes.accelerometer, 30); //15

export default class App extends Component {
  state = {
    x: 0,
    y: 0,
    isGameReady: false,
  };

  constructor(props) {
    super(props);

    const {engine, world} = this.addObjectsToWorld(ball);
    this.entities = this.getEntities(engine, world, ball);

    this.physics = (entities, {time}) => {
      let engine = entities.physics.engine;
      engine.world.gravity.y = 10; //0.5
      Matter.Engine.update(engine, time.delta);
      return entities;
    };
  }

  componentDidMount() {
    accelerometer.subscribe(({x, y}) => {
      Matter.Body.setPosition(ball, {
        x: this.state.x + x,
        y: this.state.y + y,
      });

      this.setState(
        state => ({
          x: x + state.x,
          y: y + state.y,
        }),
        () => {
          if (
            this.state.x < 0 ||
            this.state.x > width ||
            this.state.y < 0 ||
            this.state.y > height
          ) {
            Matter.Body.setPosition(ball, {
              x: mid_point,
              y: mid_point,
            });

            this.setState({
              x: mid_point,
              y: mid_point,
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

  addObjectsToWorld = ball => {
    const engine = Matter.Engine.create({enableSleeping: false});
    const world = engine.world;

    let objects = [ball, floor];

    Matter.World.add(world, objects);

    return {
      engine,
      world,
    };
  };

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
    backgroundColor: '#F5FCFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});
