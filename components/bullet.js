//Variables & constants
let blueTurretShootingInteval;
let redTurretShootingInteval;
let hitCounter = 0;
let scoreCounter = 0;
let attributeNumber = 0;
let turretAnimationTriggered;
let bossTriggered;
let colorChangeCount = 0;
let healthPercentage = 100;

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

function changeScale(object, value) {
  object.setAttribute('animation__scale', {
    property: 'scale',
    to: `${value} 1 1`,
    dur: 1000,
    loop: false,
  });
}

function animateColorChange(element, totalChanges, duration) {
  let colorChangeCount = 0;
  const intervalDuration = duration / (totalChanges * 2);
  const colorChangeInterval = setInterval(() => {
    if (colorChangeCount % 2 === 0) {
      element.setAttribute('color', '#51d312');
    } else {
      element.setAttribute('color', 'black');
    }

    colorChangeCount++;

    if (colorChangeCount === totalChanges * 2) {
      clearInterval(colorChangeInterval);
    }
  }, intervalDuration);
}

function startGame() {
  const scene = document.querySelector('a-scene');
  const startButton = document.querySelector('#startButton');
  const gameOver = document.querySelector('#gameOver');
  const hpBar = document.querySelector('#hp-bar');
  const comboBar = document.querySelector('#combo-bar');
  const scoreFinishBar = document.querySelector('#score-bar-finish');
  const scoreBar = document.querySelector('#score-bar');
  turretAnimationTriggered = false;
  bossTriggered = false;
  let gameOverSound = document.querySelector('#gameOverSound');
  gameOverSound.components.sound.stopSound();
  let Soundtrack = document.querySelector('#Soundtrack');
  Soundtrack.components.sound.playSound();

  hpBar.setAttribute('scale', `1 1 1`);
  comboBar.setAttribute('scale', `0 1 1`);
  scoreBar.setAttribute('text', {
    value: `${scoreCounter}`,
  });

  startButton.setAttribute('position', '0 0 21');
  startButton.setAttribute('visible', 'false');

  scoreFinishBar.setAttribute('position', '0 0 21');
  scoreFinishBar.setAttribute('visible', 'false');

  gameOver.setAttribute('visible', 'false');
  gameOver.setAttribute('animation__move', {
    property: 'position',
    to: '0 3 -4',
    dur: 2000,
    loop: false,
  });

  scene.setAttribute('spawn-blue-targets', '');
  scene.setAttribute('spawn-hp', '');
  scene.setAttribute('bullet', '');
  turretBlueAnimation();

  blueTurretShootingInteval = setInterval(turretBlueShooting, 1200);
}

function countHits() {
  const scene = document.querySelector('a-scene');
  let comboBar = document.querySelector('#combo-bar');
  let scoreBar = document.querySelector('#score-bar');
  let scoreFinishBarText = document.querySelector('#score-bar-finish-text');
  let colorChangingBox = document.querySelector('#comboIndecator');

  hitCounter++;
  scoreCounter += hitCounter * 100;
  if (hitCounter < 10) {
    const currentScale = comboBar.getAttribute('scale');
    const newXScale = parseFloat(currentScale.x) + 0.2;
    changeScale(comboBar, newXScale);
    attributeNumber = `#number${hitCounter}`;
  } else if (hitCounter == 10 && !turretAnimationTriggered) {
    turretRedAnimation();
    clearInterval(blueTargetSpawnInterval);
    scene.setAttribute('spawn-red-targets', '');
    redTurretShootingInteval = setInterval(turretRedShooting, 4700);
    turretAnimationTriggered = true;
    attributeNumber = `#number${hitCounter}`;
    hitCounter = 0;
  } else {
    attributeNumber = `#number${hitCounter}`;
    hitCounter = 0;
  }
  if (hitCounter % 5 == 0) {
    health += 10;
    animateColorChange(colorChangingBox, 3, 1000);
    changeScale(comboBar, 0);
  }
  scoreBar.setAttribute('text', {
    value: `${scoreCounter}`,
  });
  scoreFinishBarText.setAttribute('text', {
    value: `${scoreCounter}`,
  });
}

function turretRedShooting() {
  const scene = document.querySelector('a-scene');
  const turretRed = document.querySelector('#shootingSpotRed');
  const comboBar = document.querySelector('#combo-bar');
  const laserShootSound = document.querySelector('#redLaserShootSound');
  const laserReloadSound = document.querySelector('#redLaserReloadSound');
  const velocity = 30;

  clearInterval(blueTurretShootingInteval);
  blueTurretShootingInteval = setInterval(turretBlueShooting, 1200);

  const turretPositionRed = new THREE.Vector3();
  turretRed.object3D.getWorldPosition(turretPositionRed);

  const camera = document.querySelector('a-camera');
  const cursor = document.querySelector('[cursor]');

  const cameraPosition = new THREE.Vector3();
  camera.object3D.getWorldPosition(cameraPosition);

  const cursorPosition = new THREE.Vector3();
  cursor.object3D.getWorldPosition(cursorPosition);

  const direction = new THREE.Vector3();
  direction.subVectors(cursorPosition, cameraPosition).normalize();

  const bulletRed = document.createElement('a-entity');
  const lineEndPosition = {
    x: turretPositionRed.x + direction.x,
    y: turretPositionRed.y + direction.y,
    z: turretPositionRed.z + direction.z,
  };
  bulletRed.setAttribute('line', {
    start: `${turretPositionRed.x} ${turretPositionRed.y} ${turretPositionRed.z}`,
    end: `${lineEndPosition.x} ${lineEndPosition.y} ${lineEndPosition.z}`,
    color: 'red',
  });
  bulletRed.setAttribute('opacity', '0.8');
  bulletRed.setAttribute('raycaster', {
    direction: direction,
    far: 1,
    interval: 50,
  });
  bulletRed.setAttribute(
    'bullet',
    `velocity: ${direction.x * velocity} ${direction.y * velocity} ${direction.z * velocity}`,
  );
  scene.appendChild(bulletRed);
  laserShootSound.components.sound.playSound();
  laserReloadSound.components.sound.playSound();

  turretRedRecoil();

  const raycaster = new THREE.Raycaster(cameraPosition, direction);
  const intersects = raycaster.intersectObject(scene.object3D, true);

  if (intersects.length > 0.1) {
    const target = intersects[0].object.el;

    if (target.id.startsWith('redTarget')) {
      countHits();
      const number = document.createElement('a-entity');

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
        if (bulletRed && bulletRed.parentNode) {
          bulletRed.parentNode.removeChild(bulletRed);
        }
        if (target && target.parentNode) {
          target.parentNode.removeChild(target);
        }
        scene.appendChild(number);
        impactSound.components.sound.playSound();
      }, timeToDisappear * 1000);
    } else if (target.id.startsWith('hp')) {
      const targetPosition = new THREE.Vector3();
      target.object3D.getWorldPosition(targetPosition);
      const distance = cameraPosition.distanceTo(targetPosition);
      const timeToDisappear = distance / velocity;
      health += 10;
      console.log('hp added');
      setTimeout(() => {
        if (bulletRed && bulletRed.parentNode) {
          bulletRed.parentNode.removeChild(bulletRed);
        }
        if (target && target.parentNode) {
          target.parentNode.removeChild(target);
        }
        hpSound.components.sound.playSound();
      }, timeToDisappear * 1000);
    } else if (target.id.startsWith('blueTarget')) {
      const targetPosition = new THREE.Vector3();
      target.object3D.getWorldPosition(targetPosition);
      const distance = cameraPosition.distanceTo(targetPosition);
      const timeToDisappear = distance / velocity;
      setTimeout(() => {
        if (bulletRed && bulletRed.parentNode) {
          bulletRed.parentNode.removeChild(bulletRed);
        }
        if (target && target.parentNode) {
          target.parentNode.removeChild(target);
        }
        impactSound.components.sound.playSound();
      }, timeToDisappear * 1000);
      hitCounter = 0;
      missSound.components.sound.playSound();
      health -= 5;
      changeScale(comboBar, 0);
      console.log('Попали не в ту мишень');
    } else if (target.id.startsWith('boss')) {
      hitBoss();
    } else {
      hitCounter = 0;
      missSound.components.sound.playSound();
      health -= 10;
      changeScale(comboBar, 0);
      console.log('Промах');
    }
  }
  checkHp(health, maxHealth);

  setTimeout(() => {
    if (bulletRed && bulletRed.parentNode) {
      bulletRed.parentNode.removeChild(bulletRed);
    }
  }, 2000);
}

function turretBlueShooting() {
  const scene = document.querySelector('a-scene');
  const comboBar = document.querySelector('#combo-bar');
  const velocity = 40;

  const camera = document.querySelector('a-camera');
  const cursor = document.querySelector('[cursor]');

  const laserShootSound = document.querySelector('#laserShootSound');
  const laserReloadSound = document.querySelector('#laserReloadSound');
  const impactSound = document.querySelector('#impactSound');
  const bossImpactSound = document.querySelector('#bossImpactSound');
  const missSound = document.querySelector('#missSound');
  const hpSound = document.querySelector('#hpSound');

  const turret = document.querySelector('#shootingSpotBlue');
  const turretPosition = new THREE.Vector3();

  turret.object3D.getWorldPosition(turretPosition);

  const cameraPosition = new THREE.Vector3();
  camera.object3D.getWorldPosition(cameraPosition);

  const cursorPosition = new THREE.Vector3();
  cursor.object3D.getWorldPosition(cursorPosition);

  const direction = new THREE.Vector3();
  direction.subVectors(cursorPosition, cameraPosition).normalize();

  const bullet = document.createElement('a-entity');
  const lineEndPosition = {
    x: turretPosition.x + direction.x,
    y: turretPosition.y + direction.y,
    z: turretPosition.z + direction.z,
  };
  bullet.setAttribute('line', {
    start: `${turretPosition.x} ${turretPosition.y} ${turretPosition.z}`,
    end: `${lineEndPosition.x} ${lineEndPosition.y} ${lineEndPosition.z}`,
    color: '#00FFFF',
  });
  bullet.setAttribute('opacity', '0.8');
  bullet.setAttribute('raycaster', {
    direction: direction,
    far: 1,
    interval: 50,
  });
  bullet.setAttribute(
    'bullet',
    `velocity: ${direction.x * velocity} ${direction.y * velocity} ${direction.z * velocity}`,
  );
  scene.appendChild(bullet);
  turretBlueRecoil();

  laserShootSound.components.sound.playSound();
  laserReloadSound.components.sound.playSound();

  const raycaster = new THREE.Raycaster(cameraPosition, direction);
  const intersects = raycaster.intersectObject(scene.object3D, true);
  if (intersects.length > 0.1) {
    const target = intersects[0].object.el;

    if (target.id.startsWith('blueTarget')) {
      countHits();
      const number = document.createElement('a-entity');

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
    } else if (target.id.startsWith('redTarget')) {
      const targetPosition = new THREE.Vector3();
      target.object3D.getWorldPosition(targetPosition);
      const distance = cameraPosition.distanceTo(targetPosition);
      const timeToDisappear = distance / velocity;
      setTimeout(() => {
        if (bullet && bullet.parentNode) {
          bullet.parentNode.removeChild(bullet);
        }
        if (target && target.parentNode) {
          target.parentNode.removeChild(target);
        }
        impactSound.components.sound.playSound();
      }, timeToDisappear * 1000);
      hitCounter = 0;

      missSound.components.sound.playSound();
      health -= 5;
      changeScale(comboBar, 0);
      console.log('Попали не в ту мишень');
    } else if (target.id.startsWith('boss')) {
      countHits();
      hitBoss();
      const targetPosition = new THREE.Vector3();
      target.object3D.getWorldPosition(targetPosition);
      const distance = cameraPosition.distanceTo(targetPosition);
      const timeToDisappear = distance / velocity;
      setTimeout(() => {
        if (bullet && bullet.parentNode) {
          bullet.parentNode.removeChild(bullet);
        }
        bossImpactSound.components.sound.playSound();
      }, timeToDisappear * 1000);
    } else {
      hitCounter = 0;
      missSound.components.sound.playSound();
      health -= 10;
      changeScale(comboBar, 0);
      console.log('Промах');
    }
  }
  checkHp(health, maxHealth);
  const timer = setTimeout(() => {
    if (bullet && bullet.parentNode) {
      bullet.parentNode.removeChild(bullet);
    }
  }, 2000);
  bossAppearance();
}
