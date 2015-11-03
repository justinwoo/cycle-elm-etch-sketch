import Elm from './Board.elm';

export default function makeBoardDriver() {
  return function boardDriver(model$) {
    const board = Elm.fullscreen(Elm.Board, {
      model: {
        points: [],
        cursor: [0, 0]
      }
    });

    model$.subscribe(function (model) {
      board.ports.model.send(model);
    });
  };
}
