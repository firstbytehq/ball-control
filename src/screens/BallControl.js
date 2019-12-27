import React, {useState} from 'react';

import {View, Button, StyleSheet} from 'react-native';

const ballContainerWidth = 370; //Initialize container width and ball width
const ballDiameter = 20;

const BallControl = () => {
  const [ballPosition, setBallPosition] = useState({x: 0, y: 0}); // Initialize ball position with co-ordinates(x,y) i.e(0,0)

  let N = 10; //pixel range value for ball position change
  let ballXCoordinate = ballPosition.x;
  let ballYCoordinate = ballPosition.y;

  const ballPositionStyles = {
    top: ballYCoordinate,
    left: ballXCoordinate,
  };

  // to set horizontal boundary

  // control ball right movement
  const ballMoveToRight = () => {
    setBallPosition({
      x:
        ballXCoordinate + N <= ballContainerWidth - ballDiameter
          ? ballXCoordinate + N
          : ballXCoordinate,
      y: ballYCoordinate,
    });
  };
  // control ball left movement
  const ballMoveToLeft = () => {
    setBallPosition({
      x: ballXCoordinate - N >= 0 ? ballXCoordinate - N : ballXCoordinate,
      y: ballYCoordinate,
    });
  };

  // to set vertical boundary

  // control ball top movement
  const ballMoveToTop = () => {
    setBallPosition({
      x: ballXCoordinate,
      y: ballYCoordinate - N >= 0 ? ballYCoordinate - N : ballYCoordinate,
    });
  };
  // control ball bottom movement
  const ballMoveToBottom = () => {
    setBallPosition({
      x: ballXCoordinate,
      y:
        ballYCoordinate + N <= ballContainerWidth - ballDiameter
          ? ballYCoordinate + N
          : ballYCoordinate,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.ballContainer}>
        <View style={[styles.ball, ballPositionStyles]} />
      </View>
      <Button onPress={() => ballMoveToRight()} title="right" />
      <Button onPress={() => ballMoveToLeft()} title="left" />
      <Button onPress={() => ballMoveToTop()} title="top" />
      <Button onPress={() => ballMoveToBottom()} title="bottom" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  ballContainer: {
    height: ballContainerWidth,
    width: ballContainerWidth,
    borderWidth: 1,
    marginBottom: 10,
  },
  ball: {
    height: 20,
    width: ballDiameter,
    borderWidth: 1,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default BallControl;
