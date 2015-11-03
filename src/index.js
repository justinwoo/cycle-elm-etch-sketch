import Rx from 'rx';
import Cycle from '@cycle/core';

import makeBoardDriver from './board-driver';
import makeKeyboardDriver, {
  UP, DOWN, LEFT, RIGHT
} from './keyboard-driver';

function deduplicatePoints(points) {
  let newPoints = [];
  const pointsObject = points.reduce(function (aggregate, point) {
    aggregate[point.join(',')] = point;
    return aggregate;
  }, {});

  for (let key in pointsObject) {
    newPoints.push(pointsObject[key]);
  }

  return newPoints;
}

function addPoint(model) {
  let points = model.points.slice();

  points.push(model.cursor);
  return points;
}

function main(drivers) {
  const INITIAL_STATE = {
    points: [],
    cursor: [0, 0]
  };

  const state$ = drivers.keyboard
    .scan(function (model, direction) {
      if (!direction) return model;

      const points = deduplicatePoints(addPoint(model));
      let [cursorX, cursorY] = model.cursor;

      switch (direction) {
        case UP:
          cursorY++;
          break;
        case DOWN:
          cursorY--;
          break;
        case LEFT:
          cursorX--;
          break;
        case RIGHT:
          cursorX++;
          break;
      }

      return {
        points,
        cursor: [cursorX, cursorY]
      };
    }, INITIAL_STATE);

  return {
    board: state$
  };
}

let drivers = {
  keyboard: makeKeyboardDriver(),
  board: makeBoardDriver()
};

Cycle.run(main, drivers);
