AFRAME.registerComponent('bullet', {
  schema: {
    velocity: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
  },

  init: function () {
    this.el.addEventListener('componentchanged', (event) => {
      if (event.detail.name === 'position') {
        this.checkCollision();
      }
    });
  },

  tick: function () {
    const position = this.el.getAttribute('position');
    const velocity = this.data.velocity;
    position.x += velocity.x * 0.016;
    position.y += velocity.y * 0.016;
    position.z += velocity.z * 0.016;
    this.el.setAttribute('position', position);
  },

  checkCollision: function () {},
});
let shootingTime;

function startGame() {
  const scene = document.querySelector('a-scene');
  const startButton = document.querySelector('#startButton');
  const gameOver = document.querySelector('#gameOver');
  const hpBar = document.querySelector('#hp-bar');
  let hitCounter = 0;
  let turretAnimationTriggered = false;
  let attributeNumber = 0;

  hpBar.setAttribute('scale', `1 1 1`);

  startButton.setAttribute('position', '0 0 21');
  startButton.setAttribute('visible', 'false');

  gameOver.setAttribute('visible', 'false');
  gameOver.setAttribute('animation__move', {
    property: 'position',
    to: '0 3 -4',
    dur: 2000,
    loop: false,
  });

  scene.setAttribute('spawn-targets', '');
  scene.setAttribute('spawn-hp', '');
  scene.setAttribute('bullet', '');
  turretBlueAnimation();

  shootingTime = setInterval(autoShooting, 1500);

  function autoShooting() {
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');

    const laserShootSound = document.querySelector('#laserShootSound');
    const laserReloadSound = document.querySelector('#laserReloadSound');
    const impactSound = document.querySelector('#impactSound');
    const missSound = document.querySelector('#missSound');
    const hpSound = document.querySelector('#hpSound');

    const turret = document.querySelector('#shootingSpotBlue');
    const turretPosition = new THREE.Vector3();

    turret.object3D.getWorldPosition(turretPosition);

    const velocity = 20;
    const cameraPosition = new THREE.Vector3();
    camera.object3D.getWorldPosition(cameraPosition);

    const cursorPosition = new THREE.Vector3();
    cursor.object3D.getWorldPosition(cursorPosition);

    const direction = new THREE.Vector3();
    direction.subVectors(cursorPosition, cameraPosition).normalize();
    const bullet = document.createElement('a-sphere');
    bullet.setAttribute('radius', '0.05');
    bullet.setAttribute('position', turretPosition);
    bullet.setAttribute('color', '#00FFFF');
    bullet.setAttribute('opacity', '0.7');
    bullet.setAttribute('bullet', '');
    bullet.setAttribute('raycaster', {
      direction: direction,
      far: 1,
      interval: 50,
    });
    bullet.setAttribute(
      'bullet',
      `velocity: ${direction.x * velocity} ${direction.y * velocity} ${direction.z * velocity}`,
    );

    // Добавляем пулю на сцену
    const scene = document.querySelector('a-scene');
    scene.appendChild(bullet);
    turretBlueRecoil();

    laserShootSound.components.sound.playSound();
    laserReloadSound.components.sound.playSound();

    const raycaster = new THREE.Raycaster(cameraPosition, direction);
    const intersects = raycaster.intersectObject(scene.object3D, true);

    if (intersects.length > 0.1) {
      const target = intersects[0].object.el;

      if (target.id.startsWith('target')) {
        hitCounter++;

        if (hitCounter < 10) {
          attributeNumber = `#number${hitCounter}`;
        } else if (hitCounter == 10 && !turretAnimationTriggered) {
          turretRedAnimation();
          turretAnimationTriggered = true;
          attributeNumber = `#number${hitCounter}`;
          hitCounter = 0;
        } else {
          attributeNumber = `#number${hitCounter}`;
          hitCounter = 0;
        }

        const number = document.createElement('a-entity');
        const targetId = target.id;
        const targetEntity = document.querySelector(`#${targetId}`);
        const targetPosition = new THREE.Vector3();
        target.object3D.getWorldPosition(targetPosition);
        const distance = cameraPosition.distanceTo(targetPosition);

        number.setAttribute('scale', '1 1 1');
        number.setAttribute('position', targetPosition);
        number.setAttribute('gltf-model', attributeNumber);
        number.setAttribute('animation__rotation', {
          property: 'rotation',
          to: '0 360 0',
          dur: 1000,
          loop: true,
        });
        number.setAttribute('animation__move', {
          property: 'position',
          to: `${targetPosition.x} ${targetPosition.y + 17} ${targetPosition.z}`,
          dur: 1000,
          loop: false,
        });

        setTimeout(() => {
          scene.removeChild(number);
        }, 2000);
        const timeToDisappear = distance / velocity;
        health -= 2.5;
        console.log('Попадание!');
        setTimeout(() => {
          if (bullet && bullet.parentNode) {
            bullet.parentNode.removeChild(bullet);
          }
          if (target && target.parentNode) {
            target.parentNode.removeChild(target);
          }
          scene.appendChild(number);
          impactSound.components.sound.playSound();
        }, timeToDisappear * 1000);
      } else if (target.id.startsWith('hp')) {
        const targetId = target.id;
        const targetEntity = document.querySelector(`#${targetId}`);
        const targetPosition = new THREE.Vector3();
        target.object3D.getWorldPosition(targetPosition);
        const distance = cameraPosition.distanceTo(targetPosition);
        const timeToDisappear = distance / velocity;
        health += 10;
        console.log('hp added');
        setTimeout(() => {
          if (bullet && bullet.parentNode) {
            bullet.parentNode.removeChild(bullet);
          }
          if (target && target.parentNode) {
            target.parentNode.removeChild(target);
          }
          hpSound.components.sound.playSound();
        }, timeToDisappear * 1000);
      } else {
        hitCounter = 0;
        missSound.components.sound.playSound();
        health -= 20;
        console.log('Промах');
      }
    }
    checkHp(health, maxHealth);
    const timer = setTimeout(() => {
      if (bullet && bullet.parentNode) {
        bullet.parentNode.removeChild(bullet);
      }
    }, 2000);
  }
}
