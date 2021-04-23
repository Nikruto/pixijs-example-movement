export enum Keys {
  W = 87,
  S = 83,
  A = 65,
  D = 68,
}

interface KeyboardOptions {
  handleFocus: boolean;
  handleRepeat: boolean;
}

class Keyboard {
  private keyMap: { [key: number]: boolean } = {};
  private keyDownSubscribers: Map<number, Array<Function>> = new Map();
  private keyUpSubscribers: Map<number, Array<Function>> = new Map();
  private subscribed: Boolean = false;
  private options: KeyboardOptions;
  constructor(
    options: KeyboardOptions = { handleFocus: true, handleRepeat: true },
  ) {
    this.options = options;

    this.Subscribe();
  }

  public SubscribeOnKeyDown(keycode: number, callback: Function) {
    if (!this.keyDownSubscribers.has(keycode))
      return this.keyDownSubscribers.set(keycode, [callback]);

    const currentSubscribers = this.keyDownSubscribers.get(
      keycode,
    ) as Function[];
    this.keyDownSubscribers.set(keycode, [...currentSubscribers, callback]);
  }

  public SubscribeOnKeyUp(keycode: number, callback: Function) {
    if (!this.keyUpSubscribers.has(keycode))
      return this.keyUpSubscribers.set(keycode, [callback]);

    const currentSubscribers = this.keyUpSubscribers.get(keycode) as Function[];
    this.keyUpSubscribers.set(keycode, [...currentSubscribers, callback]);
  }

  public IsKeyDown(keycode: number): boolean {
    return this.keyMap[keycode] == true;
  }

  private Subscribe() {
    if (this.subscribed) return;

    if (this.options.handleFocus) {
      window.addEventListener('focus', (e) => this.VisibilityHandler('focus'));
      window.addEventListener('blur', (e) => this.VisibilityHandler('blur'));
    }

    window.addEventListener('keydown', (e) => this.KeyDownHandler(e.keyCode));
    window.addEventListener('keyup', (e) => this.KeyUpHandler(e.keyCode));

    this.subscribed = true;
  }

  private UnSubscribe() {
    if (!this.subscribed) return;
    if (this.options.handleFocus) {
      window.removeEventListener('focus', (e) =>
        this.VisibilityHandler('focus'),
      );
      window.removeEventListener('blur', (e) => this.VisibilityHandler('blur'));
    }

    window.removeEventListener('keydown', (e) =>
      this.KeyDownHandler(e.keyCode),
    );
    window.removeEventListener('keyup', (e) => this.KeyUpHandler(e.keyCode));

    this.subscribed = false;
  }

  private VisibilityHandler(newState: 'focus' | 'blur') {
    if (newState == 'blur') {
      Object.keys(this.keyMap).forEach((key) => {
        let keyAsNumber = (key as unknown) as number;
        this.keyMap[keyAsNumber] == true
          ? this.KeyUpHandler(keyAsNumber)
          : null;
      });
    }
  }

  private KeyDownHandler(keyCode: number) {
    if (this.options.handleRepeat && this.keyMap[keyCode] == true) return;

    let subscribersToThisKey = this.keyDownSubscribers.get(keyCode);

    if (subscribersToThisKey != undefined) {
      subscribersToThisKey.map((sub) => sub());
    }

    this.keyMap[keyCode] = true;
  }

  private KeyUpHandler(keyCode: number) {
    let subscribersToThisKey = this.keyUpSubscribers.get(keyCode);

    if (subscribersToThisKey != undefined) {
      subscribersToThisKey.map((sub) => sub());
    }
    this.keyMap[keyCode] = false;
  }
}

export default Keyboard;
