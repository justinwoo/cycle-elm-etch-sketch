import Elm from './Board.elm';

export default function makeBoardDriver() {
  return function boardDriver(model$) {
    let board;

    model$.first().subscribe(function (model) {
      board = Elm.fullscreen(Elm.Board, {
        model
      });
    });

    model$.subscribe(function (model) {
      board.ports.model.send(model);
    });
  };
}
