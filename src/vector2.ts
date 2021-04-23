class Vector2 {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public Add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public MultiplyScalar(other: number): Vector2 {
    return new Vector2(this.x * other, this.y * other);
  }
}

export default Vector2;
