import Vector2 from '../vector2';
import Keyboard, { Keys } from './keyboard';
import Mouse from './mouse';

namespace Input {
  export let keyboard: Keyboard;
  export let mouse: Mouse;

  export const Initialize = () => {
    keyboard = new Keyboard();
    mouse = new Mouse();
  };

  export const GetRawAxis = (): Vector2 => {
    let x = keyboard.IsKeyDown(Keys.D) ? 1 : 0;
    x += keyboard.IsKeyDown(Keys.A) ? -1 : 0;

    let y = keyboard.IsKeyDown(Keys.S) ? 1 : 0;
    y += keyboard.IsKeyDown(Keys.W) ? -1 : 0;

    return new Vector2(x, y);
  };
}

Input.Initialize();

export default Input;
