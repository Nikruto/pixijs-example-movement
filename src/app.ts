import * as pixi from 'pixi.js';
import Input from './Input/input';
import Vector2 from './vector2';

class App {
  private app: pixi.Application;

  constructor() {
    this.app = new pixi.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    document.body.appendChild(this.app.view);

    let graph = new pixi.Graphics();
    this.app.stage.addChild(graph);

    let playerPos = new Vector2();

    this.app.ticker.add(() => {
      playerPos = playerPos.Add(Input.GetRawAxis().MultiplyScalar(20));
      graph.clear();
      graph.beginFill(0xffffff);
      graph.drawCircle(playerPos.x, playerPos.y, 10);
    });
  }
}

export default App;
