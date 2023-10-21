let health = 100;
const maxHealth = 100;

function checkHp(currentHp, maxHp) {
  const hpBar = document.querySelector('#hp-bar');
  if (currentHp > maxHp) {
    currentHp = maxHp;
  } else if (currentHp <= 0) {
    currentHp = 0;
    hpBar.setAttribute('scale', `0 1 1`);
    gameOver();
  }
  const healthPercentage = currentHp / maxHp;
  changeScale(hpBar, healthPercentage);
}

let hpSpawnInterval;
AFRAME.registerComponent('spawn-hp', {
  init: function () {
    const scene = this.el;
    const spacing = 2;
    let hpCounter = 0;

    function isPositionOccupied(x, y) {
      const targets = scene.querySelectorAll('[data-raycastable]');
      for (const target of targets) {
        const position = target.getAttribute('position');
        const targetX = position.x;
        const targetY = position.y;
        let distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));

        if (distance < spacing) {
          return true;
        }
      }
      return false;
    }

    function spawnHP() {
      const currentHpCounter = hpCounter;
      const hp = document.createElement('a-entity');
      do {
        randomX = Math.random() * 10 - 5;
        randomY = Math.random() * 10 - 5;
      } while (isPositionOccupied(randomX, randomY));
      hp.setAttribute('radius', '0.1');
      hp.setAttribute('rotation', '45 0 0');
      hp.setAttribute('position', {
        x: randomX,
        y: randomY,
        z: -15,
      });

      hp.setAttribute('scale', '0 0 0');
      hp.setAttribute('animation__scale', {
        property: 'scale',
        to: '0.002 0.002 0.002',
        dur: 1000,
        easing: 'easeOutElastic',
      });
      hp.setAttribute('animation__rotation', {
        property: 'rotation',
        to: '90 360 0',
        dur: 5000,
        loop: true,
      });

      hp.setAttribute('gltf-model', '#hpModel');
      hp.setAttribute('data-raycastable', '');
      hp.setAttribute('id', 'hp' + currentHpCounter);
      scene.appendChild(hp);
      setTimeout(() => {
        const hp = document.querySelector(`#hp${currentHpCounter}`);
        if (hp && hp.parentNode) {
          scene.removeChild(hp);
        }
      }, 5000);

      hpCounter++;
    }
    hpSpawnInterval = setInterval(spawnHP, 10000);
  },
});
