import Rx from 'rx';

import Elm from './Board.elm';

export default function makeBoardDriver() {
  return function boardDriver(model$) {
    let board;
    let screenClick$ = new Rx.Subject();
    let requestScreenClear$ = screenClick$
      .buffer(function() {
        return screenClick$.debounce(250);
      })
      .map(function (events) {
        return events.length;
      })
      .filter(function (clicks) {
        return clicks >= 2;
      });

    model$.first().subscribe(function (model) {
      board = Elm.fullscreen(Elm.Board, {
        model
      });

      board.ports.mouseClicks.subscribe(function () {
        screenClick$.onNext();
      });
    });

    model$.subscribe(function (model) {
      board.ports.model.send(model);
    });

    return {
      requestScreenClear$
    };
  };
}
