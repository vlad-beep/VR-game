function bossAppearance() {
  if (scoreCounter > 15000 && !bossTriggered) {
    const scene = document.querySelector('a-scene');
    const healthBar = document.querySelector('#health-bar-container');
    healthBar.style.display = 'block';
    healthPercentage = 100;
    updateHealthBar(healthPercentage);
    bossTriggered = true;
    let Soundtrack = document.querySelector('#Soundtrack');
    Soundtrack.components.sound.stopSound();
    const bossSound = document.querySelector('#bossSound');
    bossSound.components.sound.playSound();

    clearInterval(blueTurretShootingInteval);
    clearInterval(redTurretShootingInteval);
    clearInterval(blueTargetSpawnInterval);
    clearInterval(redTargetSpawnInterval);
    clearInterval(hpSpawnInterval);

    scene.removeAttribute('spawn-blue-targets');
    scene.removeAttribute('spawn-red-targets');

    const targets = scene.querySelectorAll('[data-raycastable]');
    targets.forEach((target) => {
      target.setAttribute('animation__position', {
        property: 'position',
        to: `0 1 -15`,
        dur: 1000,
        easing: 'linear',
      });
      setTimeout(() => {
        if (target && target.parentNode) {
          target.parentNode.removeChild(target);
        }
      }, 1000);
    });
    setTimeout(() => {
      scene.setAttribute('spawn-boss', '');
      blueTurretShootingInteval = setInterval(turretBlueShooting, 1200);
    }, 1000);
  }
}

function updateHealthBar(healthPercentage) {
  const healthBarContainer = document.querySelector('#health-bar-container');
  const healthBar = document.querySelector('#health-bar');
  const gameOverBar = document.querySelector('#gameOver');
  const scene = document.querySelector('a-scene');
  if (healthPercentage <= 0) {
    healthBar.style.width = 0 + '%';
    healthBarContainer.style.display = 'none';
    scene.removeAttribute('spawn-boss');
    const targets = scene.querySelectorAll('[data-raycastable]');
    targets.forEach((target) => {
      scene.removeChild(target);
      gameOver();
      gameOverBar.setAttribute('text', { value: 'YOU WON' });
    });
  } else {
    healthBar.style.width = healthPercentage + '%';
  }
}

function hitBoss() {
  healthPercentage -= 5;
  updateHealthBar(healthPercentage);
}

AFRAME.registerComponent('spawn-boss', {
  init: function () {
    const scene = this.el;
    function spawnBoss() {
      const boss = document.createElement('a-entity');
      boss.setAttribute('position', {
        x: 0,
        y: 2,
        z: -18,
      });
      boss.setAttribute('scale', '0.3 0.3 0.3');
      boss.setAttribute('gltf-model', '#boss');
      boss.setAttribute('data-raycastable', '');
      boss.setAttribute('id', 'boss');
      boss.setAttribute('boss-look-at-player', ''); // Додаємо новий компонент boss-look-at-player.
      boss.setAttribute('move-boss', { updateInterval: 3000 });
      scene.appendChild(boss);
    }
    spawnBoss();
  },
});

AFRAME.registerComponent('move-boss', {
  schema: {
    updateInterval: { type: 'number', default: 3000 }, // Інтервал оновлення позиції в мілісекундах.
  },
  init: function () {
    this.boss = this.el;

    // Оновлюємо позицію боса через заданий інтервал.
    setInterval(() => {
      this.moveBoss();
    }, this.data.updateInterval);
  },
  moveBoss: function () {
    // Генеруємо випадкові координати в межах вашої площини XY.
    const randomX = Math.random() * 28 - 14;
    const randomY = Math.random() * 28 - 14;
    const currentPosition = this.boss.getAttribute('position');
    // Встановлюємо нову позицію боса.
    this.boss.setAttribute('animation__position', {
      property: 'position',
      to: `${randomX} ${randomY} ${currentPosition.z}`,
      dur: 1500,
      easing: 'linear',
    });
  },
});

AFRAME.registerComponent('boss-look-at-player', {
  init: function () {
    const player = document.querySelector('a-camera'); // Знаходимо гравця за його ID
    const boss = this.el; // Знаходимо боса, якому будемо додавати цей компонент.

    // Оголошуємо функцію, яка буде викликатися для відстеження гравця та обертання боса до нього.
    const lookAtPlayer = () => {
      const playerPosition = player.object3D.position.clone(); // Отримуємо поточну позицію гравця.

      // Знайдемо напрямок, в якому бос повинен дивитися на гравця.
      const direction = new THREE.Vector3();
      direction.subVectors(playerPosition, boss.object3D.position);
      direction.normalize();

      // Отримаємо кути обертання боса для вигляду на гравця (в радіанах).
      const pitch = Math.asin(direction.y);
      const yaw = Math.atan2(-direction.x, -direction.z);

      // Перетворимо кути в градуси.
      const pitchDegrees = THREE.Math.radToDeg(pitch);
      const yawDegrees = THREE.Math.radToDeg(yaw);

      // Встановимо обертання боса.
      boss.setAttribute('rotation', {
        x: pitchDegrees,
        y: yawDegrees,
        z: 0,
      });
    };

    // Викликаємо функцію для відстеження гравця та обертання боса кожні 100 мілісекунд (10 разів на секунду).
    this.intervalId = setInterval(lookAtPlayer, 400);
  },

  remove: function () {
    // При необхідності, видаляємо інтервал при видаленні компонента.
    clearInterval(this.intervalId);
  },
});
