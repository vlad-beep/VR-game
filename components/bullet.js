function startGame() {
  const scene = document.querySelector('a-scene');
  scene.removeChild(startButton);
  scene.setAttribute('spawn-targets', '');
  scene.setAttribute('spawn-hp', '');
  turretAnimation();
  let hitCounter = 0;
  let attributeNumber = 0;
  setInterval(autoShooting, 1500);

  AFRAME.registerComponent('spawn-hp', {
    init: function () {
      const scene = this.el;
      let hpCounter = 0; // Счетчик мишеней для пополнения жизней

      function spawnHP() {
        const currentHpCounter = hpCounter; // Сохраняем текущее значение счетчика
        const hp = document.createElement('a-entity');
        hp.setAttribute('radius', '0.1');
        hp.setAttribute('position', {
          x: Math.random() * 10 - 5, // Случайная позиция по X
          y: Math.random() * 5, // Случайная позиция по Y (над мишенями)
          z: -5, // Позиция по Z будет равна 0
        });

        // Устанавливаем начальный масштаб 0 (мишень невидима)
        hp.setAttribute('scale', '0 0 0');

        // Добавляем анимацию увеличения масштаба
        hp.setAttribute('animation__scale', {
          property: 'scale',
          to: '0.6 0.6 0.6',
          dur: 1000,
          easing: 'easeOutElastic',
        });

        // Добавляем анимацию вращения вокруг своей оси
        hp.setAttribute('animation__rotation', {
          property: 'rotation',
          to: '0 360 0',
          dur: 3000, // Примерно 3 секунды на один оборот
          loop: true, // Зацикливаем анимацию
        });

        hp.setAttribute('gltf-model', '#hpModel');
        hp.setAttribute('data-raycastable', '');
        hp.setAttribute('id', 'hp' + currentHpCounter); // Уникальный id для каждой мишени для пополнения жизней
        scene.appendChild(hp);

        // Удаляем мишень для пополнения жизней через 5 секунд
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
            }, 1100); // 1000 миллисекунд (1 секунда)
          }
        }, 5000);

        hpCounter++; // Увеличиваем счетчик мишеней для пополнения жизней
      }

      // Создаем мишени для пополнения жизней каждые 5 секунд
      setInterval(spawnHP, 10000);
    },
  });

  AFRAME.registerComponent('spawn-targets', {
    init: function () {
      const scene = this.el;
      const rowCount = 5; // Количество рядов мишеней
      const targetsPerRow = 4; // Количество мишеней в ряду
      const spacing = 2; // Расстояние между мишенями
      let targetCounter = 0; // Счетчик мишеней

      for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < targetsPerRow; col++) {
          const target = document.createElement('a-entity');
          target.setAttribute('gltf-model', '#targetModel'); // Используйте свою модель мишени
          target.setAttribute('scale', '10 10 10');
          target.setAttribute(
            'animation',
            'property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true;',
          );
          target.setAttribute('position', {
            x: col * spacing - (targetsPerRow / 2) * spacing,
            y: row * spacing, // Располагаем в плоскости XY
            z: -15, // Позиция по Z будет равна 0
          });
          target.setAttribute('id', 'target' + targetCounter); // Уникальный id для каждой мишени
          target.setAttribute('data-raycastable', '');
          scene.appendChild(target);
          targetCounter++; // Увеличиваем счетчик мишеней
        }
      }
    },
  });

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

    checkCollision: function () {
      // Ничего не делаем здесь, обработка столкновений в логике ниже
    },
  });

  function turretrecoil() {
    const turretModel = document.querySelector('#turretBlue');
    turretModel.setAttribute('animation__recoil', {
      property: 'position',
      to: '0.652 -0.96 -0.587',
      dur: 150,
      loop: false,
    });
    setTimeout(() => {
      const turretModel = document.querySelector('#turretBlue');
      turretModel.setAttribute('animation__recoil', {
        property: 'position',
        to: '0.652 -0.967 -0.646',
        dur: 1500,
        loop: false,
      });
    }, 150);
  }

  function turretAnimation() {
    //position="0.652 -0.96 -0.587"
    const turretSound = document.querySelector('#turretSound');
    turretSound.components.sound.playSound();
    const turretModel = document.querySelector('#turretBlue');
    turretModel.setAttribute('animation__move', {
      property: 'position',
      to: '0.652 -0.967 -0.646',
      dur: 1200,
      loop: false,
    });
  }

  function autoShooting() {
    const camera = document.querySelector('a-camera'); // Получаем элемент камеры
    const cursor = document.querySelector('[cursor]'); // Получаем элемент курсора

    const laserShootSound = document.querySelector('#laserShootSound');
    const laserReloadSound = document.querySelector('#laserReloadSound');
    const impactSound = document.querySelector('#impactSound');
    const missSound = document.querySelector('#missSound');
    const hpSound = document.querySelector('#hpSound');

    const turret = document.querySelector('#shootingSpotBlue'); // Получаем элемент турели
    const turretPosition = new THREE.Vector3(); // Получаем текущую позицию турели

    turret.object3D.getWorldPosition(turretPosition);

    const velocity = 15;
    // Получаем позиции камеры и курсора
    const cameraPosition = new THREE.Vector3();
    camera.object3D.getWorldPosition(cameraPosition);

    const cursorPosition = new THREE.Vector3();
    cursor.object3D.getWorldPosition(cursorPosition);

    // Вычисляем вектор от камеры к курсору
    const direction = new THREE.Vector3();
    direction.subVectors(cursorPosition, cameraPosition).normalize(); // Нормализуем вектор
    // Создаем красную сферу (пулю) и задаем ей начальную позицию и цвет
    const bullet = document.createElement('a-sphere');
    bullet.setAttribute('radius', '0.05');
    bullet.setAttribute('position', turretPosition); // Начальная позиция пули равна позиции камеры
    bullet.setAttribute('color', '#00FFFF');
    bullet.setAttribute('opacity', '0.7');
    bullet.setAttribute('bullet', '');
    bullet.setAttribute('raycaster', {
      direction: direction,
      far: 1, // Увеличьте значение far по вашему усмотрению
      interval: 50, // Увеличьте интервал проверки
    });
    bullet.setAttribute(
      // Устанавливаем направление пули
      'bullet',
      `velocity: ${direction.x * velocity} ${direction.y * velocity} ${direction.z * velocity}`,
    );

    // Добавляем пулю на сцену
    const scene = document.querySelector('a-scene');
    scene.appendChild(bullet);
    turretrecoil();

    laserShootSound.components.sound.playSound();
    laserReloadSound.components.sound.playSound();

    // Используем raycaster для обнаружения столкновения с сферой-мишенью
    const raycaster = new THREE.Raycaster(cameraPosition, direction);
    const intersects = raycaster.intersectObject(scene.object3D, true);

    if (intersects.length > 0.1) {
      const target = intersects[0].object.el;

      if (target.id.startsWith('target')) {
        if (hitCounter <= 9) {
          hitCounter++;
          attributeNumber = `#number${hitCounter}`;
        } else {
          hitCounter = 1;
          attributeNumber = `#number${hitCounter}`;
        }
        const number = document.createElement('a-entity');
        const targetId = target.id;
        const targetEntity = document.querySelector(`#${targetId}`);
        const targetPosition = new THREE.Vector3();
        target.object3D.getWorldPosition(targetPosition);
        const distance = cameraPosition.distanceTo(targetPosition);

        number.setAttribute('scale', '1 1 1');
        number.setAttribute('position', targetPosition); // Начальная позиция пули равна позиции камеры
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
        // Вычисляем время, через которое мишень исчезнет
        const timeToDisappear = distance / velocity;
        console.log('Попадание!');

        // Задержка перед удалением мишени на основе вычисленного времени
        setTimeout(() => {
          impactSound.components.sound.playSound();
          scene.removeChild(target); // Удаляем сферу-мишень
          scene.removeChild(bullet);
          scene.appendChild(number);
        }, timeToDisappear * 1000); // Умножаем на 1000, чтобы перевести в миллисекунды
      } else if (target.id.startsWith('hp')) {
        const targetId = target.id;
        const targetEntity = document.querySelector(`#${targetId}`);
        const targetPosition = new THREE.Vector3();
        target.object3D.getWorldPosition(targetPosition);
        const distance = cameraPosition.distanceTo(targetPosition);

        // Вычисляем время, через которое мишень исчезнет
        const timeToDisappear = distance / velocity;
        console.log('hp added');
        setTimeout(() => {
          hpSound.components.sound.playSound();
          scene.removeChild(target); // Удаляем сферу-мишень
          scene.removeChild(bullet);
        }, timeToDisappear * 1500); // Умножаем на 1000, чтобы перевести в миллисекунды
      } else {
        hitCounter = 0;
        missSound.components.sound.playSound();
        console.log('Промах');
      }
    }
    const timer = setTimeout(() => {
      if (bullet && bullet.parentNode) {
        bullet.parentNode.removeChild(bullet); // Удаляем пулю, только если она существует и имеет родительский элемент
      }
    }, 3000);
  }
}
