interface MouseOptions {
  handleFocus: boolean;
}

export enum MouseButtons {
  left = 0,
  middle = 1,
  right = 2,
}

class Mouse {
  private buttonMap: { [key: number]: boolean } = {};
  private subscribed: Boolean = false;
  private buttonDownSubscribers: Map<MouseButtons, Array<Function>> = new Map();
  private buttonUpSubscribers: Map<MouseButtons, Array<Function>> = new Map();
  private buttonMoveSubscribers: Map<MouseButtons, Array<Function>> = new Map();
  private options: MouseOptions;
  constructor(options: MouseOptions = { handleFocus: true }) {
    this.options = options;

    this.Subscribe();
  }

  public SubscribeOnButtonDown(button: MouseButtons, callback: Function) {
    if (!this.buttonDownSubscribers.has(button))
      return this.buttonDownSubscribers.set(button, [callback]);

    const currentSubscribers = this.buttonDownSubscribers.get(
      button,
    ) as Function[];
    this.buttonDownSubscribers.set(button, [...currentSubscribers, callback]);
  }

  public SubscribeOnButtonUp(button: MouseButtons, callback: Function) {
    if (!this.buttonUpSubscribers.has(button))
      return this.buttonUpSubscribers.set(button, [callback]);

    const currentSubscribers = this.buttonUpSubscribers.get(
      button,
    ) as Function[];
    this.buttonUpSubscribers.set(button, [...currentSubscribers, callback]);
  }

  private Subscribe() {
    if (this.subscribed) return;

    if (this.options.handleFocus) {
      window.addEventListener('focus', (e) => this.VisibilityHandler('focus'));
      window.addEventListener('blur', (e) => this.VisibilityHandler('blur'));
    }

    window.addEventListener('mousedown', (e) => this.ButtonDownHandler(e));
    window.addEventListener('mouseup', (e) => this.ButtonUpHandler(e));
    window.addEventListener('mousemove', (e) => this.MouseMoveHandler(e));

    this.subscribed = true;
  }

  private UnSubscribe() {
    if (this.subscribed) return;

    if (this.options.handleFocus) {
      window.removeEventListener('focus', (e) =>
        this.VisibilityHandler('focus'),
      );
      window.removeEventListener('blur', (e) => this.VisibilityHandler('blur'));
    }

    window.removeEventListener('mousedown', (e) => this.ButtonDownHandler(e));
    window.removeEventListener('mouseup', (e) => this.ButtonUpHandler(e));
    window.removeEventListener('mousemove', (e) => this.MouseMoveHandler(e));

    this.subscribed = false;
  }

  private VisibilityHandler(newState: 'focus' | 'blur') {
    if (newState == 'blur') {
      this.buttonUpSubscribers.forEach((_, key) =>
        this.buttonMap[key] == true ? this.ButtonUpHandler(key) : null,
      );
    }
  }

  private ButtonDownHandler(e: MouseEvent) {
    if (this.buttonMap[e.button] == true) return;

    let subscribersToThisKey = this.buttonDownSubscribers.get(e.button);

    if (subscribersToThisKey != undefined) {
      subscribersToThisKey.map((sub) => sub());
    }

    this.buttonMap[e.button] = true;
  }

  private ButtonUpHandler(e: MouseEvent | MouseButtons) {
    let button: MouseButtons =
      (<MouseEvent>e)?.button !== undefined
        ? <MouseButtons>(<MouseEvent>e).button
        : <MouseButtons>e;

    if (this.buttonMap[button] !== true) return;

    let subscribersToThisKey = this.buttonUpSubscribers.get(button);

    if (subscribersToThisKey != undefined) {
      subscribersToThisKey.map((sub) => sub());
    }

    this.buttonMap[button] = false;
  }

  private MouseMoveHandler(e: MouseEvent) {}
}

export default Mouse;
