class Sprite {
  constructor({
    posisi,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this._posisi = posisi;
    this._width = 50;
    this._height = 150;
    this._image = new Image();
    this._image.src = imageSrc;
    this._scale = scale;
    this._framesMax = framesMax;
    this._currentFrame = 0;
    this._framesElapsed = 0;
    this._framesHold = 8;
    this._offset = offset;
  }

  get posisiX() {
    return this._posisi.x;
  }

  get posisiY() {
    return this._posisi.y;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get velocityX() {
    return this._velocity.x;
  }

  get velocityY() {
    return this._velocity.y;
  }

  get currentFrame() {
    return this._currentFrame;
  }

  get framesMax() {
    return this._framesMax;
  }

  get framesElapsed() {
    return this._framesElapsed;
  }

  get framesHold() {
    return this._framesHold;
  }

  get offset() {
    return this._offset;
  }

  set posisiX(newPosisiX) {
    this._posisi.x = newPosisiX;
  }

  set posisiY(newPosisiY) {
    this._posisi.y = newPosisiY;
  }

  set velocityX(newVelocityX) {
    this._velocity.x = newVelocityX;
  }

  set velocityY(newVelocityY) {
    this._velocity.y = newVelocityY;
  }

  set width(newWidth) {
    this._width = newWidth;
  }

  set height(newHeight) {
    this._height = newHeight;
  }

  set currentFrame(newCurrentFrame) {
    this._currentFrame = newCurrentFrame;
  }

  set framesMax(newFramesMax) {
    this._framesMax = newFramesMax;
  }

  set framesElapsed(newFramesElapsed) {
    this._framesElapsed = newFramesElapsed;
  }

  set framesHold(newFramesHold) {
    this._framesHold = newFramesHold;
  }

  set offset(newOffset) {
    this._offset = newOffset;
  }

  draw() {
    c.drawImage(
      this._image,
      this._currentFrame * (this._image.width / this._framesMax),
      0,
      this._image.width / this._framesMax,
      this._image.height,

      this._posisi.x - this._offset.x,
      this._posisi.y - this._offset.y,
      (this._image.width / this._framesMax) * this._scale,
      this._image.height * this._scale
    );
  }

  animateFrame() {
    this._framesElapsed++;

    if (this._framesElapsed % this._framesHold === 0) {
      if (this._currentFrame < this._framesMax - 1) {
        this._currentFrame++;
      } else {
        this._currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrame();
  }
}

class Character extends Sprite {
  constructor({
    posisi,
    velocity,
    // warna = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      posisi,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this._velocity = velocity;
    this._width = 100;
    this._height = 150;
    this._lastKey;
    this._attackBox = {
      posisi: {
        x: this._posisi.x,
        y: this._posisi.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    // this._warna = warna;
    this._isAttacking;
    this._health = 100;
    this._currentFrame = 0;
    this._framesElapsed = 0;
    this._framesHold = 13;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    // console.log(this.sprites);
  }

  get attackBoxX() {
    return this._attackBox.posisi.x;
  }

  get attackBoxY() {
    return this._attackBox.posisi.y;
  }

  get attackBoxHeight() {
    return this._attackBox.height;
  }

  get attackBoxWidth() {
    return this._attackBox.width;
  }

  get health() {
    return this._health;
  }

  // get warna() {
  //   return this._warna;
  // }

  get isAttacking() {
    return this._isAttacking;
  }

  set health(newHealth) {
    this._health = newHealth;
  }

  // set warna(warna) {
  //   this._warna = warna;
  // }

  set isAttacking(newIsAttacking) {
    this._isAttacking = newIsAttacking;
  }

  update() {
    this.draw();
    if (!this.dead) {
      this.animateFrame();
    }

    // attackBox
    this._attackBox.posisi.x = this._posisi.x + this._attackBox.offset.x;
    this._attackBox.posisi.y = this._posisi.y + this._attackBox.offset.y;

    // gambar attackBox
    // c.fillStyle = "black";
    // c.fillRect(
    //   this._attackBox.posisi.x,
    //   this._attackBox.posisi.y,
    //   this._attackBox.width,
    //   this._attackBox.height
    // );

    // movement character
    this._posisi.x += this._velocity.x;
    this._posisi.y += this._velocity.y;

    // gravity
    if (this._posisi.y + this._height >= canvas.height - 96) {
      this._velocity.y = 0;
    } else {
      this._velocity.y += gravity;

      // console.log(this._posisi.y);
    }
  }

  attack() {
    this.switchSprites("attack1");
    this._isAttacking = true;
  }

  takeHit() {
    this._health -= 10;

    if (this.health <= 0) {
      this.switchSprites("death");
    } else {
      this.switchSprites("takeHit");
    }
  }

  switchSprites(sprite) {
    //  kalo mati udah kelar
    if (this._image === this.sprites.death.image) {
      if (this._currentFrame === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }

    // overriding semua animasi dengan animasi attack
    if (
      this._image === this.sprites.attack1.image &&
      this._currentFrame < this.sprites.attack1.framesMax - 1
    )
      return;

    // override ketika character kena hit
    if (
      this._image === this.sprites.takeHit.image &&
      this._currentFrame < this.sprites.takeHit.framesMax - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this._image !== this.sprites.idle.image) {
          this._image = this.sprites.idle.image;
          this._framesMax = this.sprites.idle.framesMax;
          this._currentFrame = 0;
        }
        break;

      case "run":
        if (this._image !== this.sprites.run.image) {
          this._image = this.sprites.run.image;
          this._framesMax = this.sprites.run.framesMax;
          this._currentFrame = 0;
        }
        break;

      case "jump":
        if (this._image !== this.sprites.jump.image) {
          this._image = this.sprites.jump.image;
          this._framesMax = this.sprites.jump.framesMax;
          this._currentFrame = 0;
        }
        break;

      case "fall":
        if (this._image !== this.sprites.fall.image) {
          this._image = this.sprites.fall.image;
          this._framesMax = this.sprites.fall.framesMax;
          this._currentFrame = 0;
        }
        break;

      case "attack1":
        if (this._image !== this.sprites.attack1.image) {
          this._image = this.sprites.attack1.image;
          this._framesMax = this.sprites.attack1.framesMax;
          this._currentFrame = 0;
        }
        break;

      case "takeHit":
        if (this._image !== this.sprites.takeHit.image) {
          this._image = this.sprites.takeHit.image;
          this._framesMax = this.sprites.takeHit.framesMax;
          this._currentFrame = 0;
        }
        break;

      case "death":
        if (this._image !== this.sprites.death.image) {
          this._image = this.sprites.death.image;
          this._framesMax = this.sprites.death.framesMax;
          this._currentFrame = 0;
        }
        break;
    }
  }
}
