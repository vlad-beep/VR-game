let health = 100; // Текущий уровень здоровья
const maxHealth = 100; // Максимальный уровень здоровья

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
  hpBar.setAttribute('scale', `${healthPercentage} 1 1`); // Делим на 10, чтобы соответствовать масштабу
  console.log(currentHp);
}

let hpSpawnInterval;
AFRAME.registerComponent('spawn-hp', {
  init: function () {
    const scene = this.el;
    let hpCounter = 0;

    function spawnHP() {
      const currentHpCounter = hpCounter;
      const hp = document.createElement('a-entity');
      hp.setAttribute('radius', '0.1');
      hp.setAttribute('position', {
        x: Math.random() * 10 - 5,
        y: Math.random() * 5,
        z: -15,
      });

      hp.setAttribute('scale', '0 0 0');
      hp.setAttribute('animation__scale', {
        property: 'scale',
        to: '0.8 0.8 0.8',
        dur: 1000,
        easing: 'easeOutElastic',
      });
      hp.setAttribute('animation__rotation', {
        property: 'rotation',
        to: '0 360 0',
        dur: 3000,
        loop: true,
      });

      hp.setAttribute('gltf-model', '#hpModel');
      hp.setAttribute('data-raycastable', '');
      hp.setAttribute('id', 'hp' + currentHpCounter);
      scene.appendChild(hp);
      setTimeout(() => {
        const hp = document.querySelector(`#hp${currentHpCounter}`);
        if (hp && hp.parentNode) {
          hp.setAttribute('animation__scale', {
            property: 'scale',
            to: '0 0 0',
            dur: 900,
            easing: 'easeInElastic',
          });
          setTimeout(function () {
            scene.removeChild(hp);
          }, 1100);
        }
      }, 5000);

      hpCounter++;
    }
    hpSpawnInterval = setInterval(spawnHP, 10000);
  },
});
