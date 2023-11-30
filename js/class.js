class Sprite {
  constructor({
    posisi,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.posisi = posisi;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 8;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,

      this.posisi.x - this.offset.x,
      this.posisi.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrame() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.framesMax - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
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
    warna = "red",
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
    this.width = 100;
    this.height = 150;
    this.lastKey;
    this._attackBox = {
      posisi: {
        x: this.posisi.x,
        y: this.posisi.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this._warna = warna;
    this._isAttacking;
    this._health = 100;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 13;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    console.log(this.sprites);
  }

  getAttackBoxX() {
    return this._attackBox.posisi.x;
  }

  getAttackBoxY() {
    return this._attackBox.posisi.y;
  }

  getAttackBoxHeight() {
    return this._attackBox.height;
  }

  getAttackBoxWidth() {
    return this._attackBox.width;
  }

  getHealth() {
    return this._health;
  }

  getWarna() {
    return this._warna;
  }

  getVelocityX() {
    return this._velocity.x;
  }

  getVelocityY() {
    return this._velocity.y;
  }

  getIsAttacking() {
    return this._isAttacking;
  }

  setVelocityX(velocityx) {
    this._velocity.x = velocityx;
  }

  setVelocityY(velocity) {
    this._velocity.y = velocity;
  }

  setHealth(health) {
    this._health = health;
  }

  setWarna(warna) {
    this._warna = warna;
  }

  setIsAttacking(isAttacking) {
    this._isAttacking = isAttacking;
  }

  update() {
    this.draw();
    if (!this.dead) {
      this.animateFrame();
    }

    // attackBox
    this._attackBox.posisi.x = this.posisi.x + this._attackBox.offset.x;
    this._attackBox.posisi.y = this.posisi.y + this._attackBox.offset.y;

    // gambar attackBox
    // c.fillStyle = "black";
    // c.fillRect(
    //   this._attackBox.posisi.x,
    //   this._attackBox.posisi.y,
    //   this._attackBox.width,
    //   this._attackBox.height
    // );

    this.posisi.x += this._velocity.x;
    this.posisi.y += this._velocity.y;

    // gravity
    if (this.posisi.y + this.height >= canvas.height - 96) {
      this._velocity.y = 0;
    } else {
      this._velocity.y += gravity;

      console.log(this.posisi.y);
    }
  }

  attack() {
    this.switchSprites("attack1");
    this._isAttacking = true;
  }

  takeHit() {
    this.setHealth(this.getHealth() - 15);

    if (this.getHealth() <= 0) {
      this.switchSprites("death");
    } else {
      this.switchSprites("takeHit");
    }
  }

  switchSprites(sprite) {
    //  kalo mati udah kelar
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }

    // overriding semua animasi dengan animasi attack
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.framesMax - 1
    )
      return;

    // override ketika character kena hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.framesMax - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.currentFrame = 0;
        }
        break;

      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
