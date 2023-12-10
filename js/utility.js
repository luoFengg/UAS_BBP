function attackBox({ kotak1, kotak2 }) {
  return (
    kotak1.attackBoxX + kotak1.attackBoxWidth >= kotak2.attackBoxX &&
    kotak1.attackBoxX <= kotak2.attackBoxX + kotak2.attackBoxWidth &&
    kotak1.attackBoxY + kotak1.attackBoxHeight >= kotak2.posisiY &&
    kotak1.attackBoxY <= kotak2.posisiY + kotak2.height
  );
}

let timerId;
function menentukanYangMenang() {
  clearTimeout(timerId);
  document.getElementById("displayText").style.display = "flex";

  if (player.health === enemy.health) {
    document.getElementById("displayText").innerHTML = "Seri";
  } else if (player.health > enemy.health) {
    document.getElementById("displayText").innerHTML = "Player 1 Menang!";
  } else {
    document.getElementById("displayText").innerHTML = "Player 2 Menang!";
  }
}

let timer = 60;
function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.getElementById("timer").innerHTML = timer;
  }

  if (timer === 0) {
    menentukanYangMenang();
  }
}

function wallDetection() {
  if (player.posisiX < 0) {
    player.posisiX = 0;
  } else if (player.posisiX + player.width > canvas.width) {
    player.posisiX = canvas.width - player.width;
  } else if (player.posisiY < 0) {
    player.posisiY = 0;
    player.velocityY = 0;
  }

  if (enemy.posisiX < 0) {
    enemy.posisiX = 0;
  } else if (enemy.posisiX + enemy.width > canvas.width) {
    enemy.posisiX = canvas.width - enemy.width;
  } else if (enemy.posisiY < 0) {
    enemy.posisiY = 0;
    enemy.velocityY = 0;
  }
}


