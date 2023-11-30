const canvas = document.getElementById("canvas-id");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

const background = new Sprite({
  posisi: {
    x: 0,
    y: 0,
  },
  imageSrc: "img/background.png",
});

const shop = new Sprite({
  posisi: {
    x: 600,
    y: 130,
  },
  imageSrc: "img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Character({
  posisi: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "img/MedievalKing/Sprites/Idle.png",
  framesMax: 8,
  scale: 2.35,
  offset: {
    x: 150,
    y: 94,
  },
  sprites: {
    idle: {
      imageSrc: "img/MedievalKing/Sprites/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "img/MedievalKing/Sprites/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "img/MedievalKing/Sprites/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "img/MedievalKing/Sprites/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "img/MedievalKing/Sprites/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "img/MedievalKing/Sprites/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "img/MedievalKing/Sprites/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 30,
      y: 40,
    },
    width: 75,
    height: 50,
  },
});

const enemy = new Character({
  posisi: {
    x: canvas.width - 50,
    y: 100,
  },
  velocity: {
    x: -3,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  warna: "green",
  imageSrc: "img/EvilWizard2/Sprites/Idle.png",
  framesMax: 8,
  scale: 2.35,
  offset: {
    x: 215,
    y: 245,
  },
  sprites: {
    idle: {
      imageSrc: "img/EvilWizard2/Sprites/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "img/EvilWizard2/Sprites/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "img/EvilWizard2/Sprites/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "img/EvilWizard2/Sprites/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "img/EvilWizard2/Sprites/Attack1.png",
      framesMax: 8,
    },
    takeHit: {
      imageSrc: "img/EvilWizard2/Sprites/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "img/EvilWizard2/Sprites/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -20,
      y: 40,
    },
    width: 75,
    height: 50,
  },
});

const keys = {
  a: {
    pencet: false,
  },
  d: {
    pencet: false,
  },
  w: {
    pencet: false,
  },
  ArrowLeft: {
    pencet: false,
  },
  ArrowRight: {
    pencet: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  // c.fillStyle = "black";
  // c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  // reset velocity
  player.setVelocityX(0);
  enemy.setVelocityX(0);

  // player1 movement
  if (keys.a.pencet && player.lastKey === "a") {
    player.setVelocityX(-3);
    player.switchSprites("run");
  } else if (keys.d.pencet && player.lastKey === "d") {
    player.switchSprites("run");
    player.setVelocityX(3);
  } else {
    player.switchSprites("idle");
  }

  // player1 lompat
  if (player.getVelocityY() < 0) {
    player.switchSprites("jump");
  } else if (player.getVelocityY() > 0) {
    player.switchSprites("fall");
  }

  // enemy movement
  if (keys.ArrowLeft.pencet && enemy.lastKey === "ArrowLeft") {
    enemy.setVelocityX(-3);
    enemy.switchSprites("run");
  } else if (keys.ArrowRight.pencet && enemy.lastKey === "ArrowRight") {
    enemy.setVelocityX(3);
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }

  // enemylompat
  if (enemy.getVelocityY() < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.getVelocityY() > 0) {
    enemy.switchSprites("fall");
  }

  // cek kalo karakter nabrak tembok
  wallDetection();

  // ngecek kalo nyerang kena & musuh kena hit
  if (
    attackBox({
      kotak1: player,
      kotak2: enemy,
    }) &&
    player.getIsAttacking() &&
    player.currentFrame === 2
  ) {
    enemy.takeHit();
    player.setIsAttacking(false);

    gsap.to("#nyawaMusuh", {
      width: enemy.getHealth() + "%",
    });
    // console.log("kena LU");
  }

  // kalo player nyerang ga kena
  if (player.getIsAttacking() && player.currentFrame === 2) {
    player.setIsAttacking(false);
  }

  // kalo player kena hit
  if (
    attackBox({
      kotak1: enemy,
      kotak2: player,
    }) &&
    enemy.getIsAttacking() &&
    enemy.currentFrame === 2
  ) {
    player.takeHit();
    enemy.setIsAttacking(false);

    gsap.to("#nyawaPlayer", {
      width: player.getHealth() + "%",
    });

    console.log("kena juga LU");
  }

  // kalo enemy nyerang ga kena
  if (enemy.getIsAttacking() && enemy.currentFrame === 2) {
    enemy.setIsAttacking(false);
  }

  // end game berdasarkan HP
  if (enemy.getHealth() <= 0 || player.getHealth() <= 0) {
    menentukanYangMenang({ player, enemy, timerId });
  }
}

animate();

document.addEventListener("keydown", (event) => {
  if (!player.dead) {
    // console.log(event.key);
    switch (event.key) {
      // player1
      case "d":
        keys.d.pencet = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pencet = true;
        player.lastKey = "a";
        break;
      case "w":
        player.setVelocityY(-10);
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    // enemy
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pencet = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pencet = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.setVelocityY(-10);
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pencet = false;
      break;
    case "a":
      keys.a.pencet = false;
      break;

    // enemy
    case "ArrowRight":
      keys.ArrowRight.pencet = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pencet = false;
      break;
  }
});
