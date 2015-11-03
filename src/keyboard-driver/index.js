import Rx from 'rx';

export const UP = 'up';
export const DOWN = 'down';
export const LEFT = 'left';
export const RIGHT = 'right';

const UP_INPUTS = [38, 75];
const DOWN_INPUTS = [40, 74];
const LEFT_INPUTS = [37, 72];
const RIGHT_INPUTS = [39, 76];

const MAPPINGS = [
  [UP_INPUTS, UP],
  [DOWN_INPUTS, DOWN],
  [LEFT_INPUTS, LEFT],
  [RIGHT_INPUTS, RIGHT],
];

export default function makeKeyboardDriver() {
  return function keyboardDriver() {
    return Rx.Observable.fromEvent(window, 'keydown')
      .map(function ({keyCode}) {
        for (let i = 0; i < MAPPINGS.length; i++) {
          const [inputs, direction] = MAPPINGS[i];

          if (inputs.indexOf(keyCode) !== -1) {
            return direction;
          }
        }
      });
  }
}
