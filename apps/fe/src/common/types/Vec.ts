export class Vec {
    x: number;
    y: number;
  
    static ZERO: Vec = new Vec(0, 0);
  
    constructor(x: number = 0, y: number = 0) {
      this.x = x;
      this.y = y;
    }
  
    // 向量加法
    add(v: Vec): Vec {
      return new Vec(this.x + v.x, this.y + v.y);
    }
  
    // 向量减法
    sub(v: Vec): Vec {
      return new Vec(this.x - v.x, this.y - v.y);
    }
  
    // 数乘
    scale(scalar: number): Vec {
      return new Vec(this.x * scalar, this.y * scalar);
    }
  
    // 点乘（内积）
    dot(v: Vec): number {
      return this.x * v.x + this.y * v.y;
    }
  
    // 向量长度（欧几里得范数）
    length(): number {
      return Math.sqrt(this.dot(this));
    }
  
    // 向量规范化（单位向量）
    normalize(): Vec {
      const len = this.length();
      if (len === 0) {
        return Vec.ZERO;
      }
      return this.scale(1 / len);
    }
  
    clone() {
      return new Vec(this.x, this.y);
    }
  }
  