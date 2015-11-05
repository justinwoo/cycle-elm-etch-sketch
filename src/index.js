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

  const moveCursor$ = drivers.keyboard.directionInput$
    .map(function (direction) {
      return function (model) {
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
      };
    });

  const clearScreen$ = drivers.board.requestScreenClear$
    .map(function () {
      return function (model) {
        return {
          points: [],
          cursor: model.cursor
        };
      };
    });

  const state$ = Rx.Observable
    .merge(
      moveCursor$,
      clearScreen$
    )
    .startWith(INITIAL_STATE)
    .scan(function (state, mapper) {
      return mapper(state);
    })

  return {
    board: state$
  };
}

let drivers = {
  keyboard: makeKeyboardDriver(),
  board: makeBoardDriver()
};

Cycle.run(main, drivers);
