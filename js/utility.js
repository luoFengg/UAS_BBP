function attackBox({ kotak1, kotak2 }) {
  return (
    kotak1.getAttackBoxX() + kotak1.getAttackBoxWidth() >=
      kotak2.getAttackBoxX() &&
    kotak1.getAttackBoxX() <=
      kotak2.getAttackBoxX() + kotak2.getAttackBoxWidth() &&
    kotak1.getAttackBoxY() + kotak1.getAttackBoxHeight() >= kotak2.posisi.y &&
    kotak1.getAttackBoxY() <= kotak2.posisi.y + kotak2.height
  );
}

function menentukanYangMenang({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.getElementById("displayText").style.display = "flex";

  if (player.getHealth() === enemy.getHealth()) {
    document.getElementById("displayText").innerHTML = "Seri";
  } else if (player.getHealth() > enemy.getHealth()) {
    document.getElementById("displayText").innerHTML = "Player 1 Menang!";
  } else {
    document.getElementById("displayText").innerHTML = "Player 2 Menang!";
  }
}

function wallDetection() {
  if (player.posisi.x < 0) {
    player.posisi.x = 0;
  } else if (player.posisi.x + player.width > canvas.width) {
    player.posisi.x = canvas.width - player.width;
  } else if (player.posisi.y < 0) {
    player.posisi.y = 0;
    player.setVelocityY(0);
  }

  if (enemy.posisi.x < 0) {
    enemy.posisi.x = 0;
  } else if (enemy.posisi.x + enemy.width > canvas.width) {
    enemy.posisi.x = canvas.width - enemy.width;
  } else if (enemy.posisi.y < 0) {
    enemy.posisi.y = 0;
    enemy.setVelocityY(0);
  }
}
let timer = 60;
let timerId;
function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.getElementById("timer").innerHTML = timer;
  }

  if (timer === 0) {
    menentukanYangMenang({ player, enemy, timerId });
  }
}
