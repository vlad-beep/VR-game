AFRAME.registerComponent('spawn-targets', {
  init: function () {
    const scene = this.el;
    const maxTargets = 30; // Максимальное количество мишеней
    const spacing = 2; // Расстояние между мишенями в формации
    const targetsPerFormation = 4; // Количество мишеней в одной формации

    function countTargets() {
      // Считаем количество мишеней в сцене
      const targets = scene.querySelectorAll('[data-raycastable]');
      return targets.length;
    }

    function isPositionOccupied(x, y) {
      // Проверяем, занята ли позиция (x, y) другой мишенью
      const targets = scene.querySelectorAll('[data-raycastable]');
      for (const target of targets) {
        const position = target.getAttribute('position');
        const targetX = position.x;
        const targetY = position.y;
        const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
        if (distance < spacing) {
          return true; // Позиция уже занята
        }
      }
      return false; // Позиция свободна
    }

    function createFormation() {
      const currentTargetCount = countTargets();

      if (currentTargetCount < maxTargets) {
        // Если мишеней меньше 30, создаем новую формацию

        // Случайно выбираем тип формации: 0 - горизонтальная, 1 - вертикальная
        const formationType = Math.floor(Math.random() * 2);

        let randomX, randomY;

        if (formationType === 0) {
          // Горизонтальная формация
          do {
            randomX = Math.random() * 16 - 8;
            randomY = Math.random() * 20 - 10;
          } while (isPositionOccupied(randomX, randomY));
        } else {
          // Вертикальная формация
          do {
            randomX = Math.random() * 20 - 10;
            randomY = Math.random() * 16 - 8;
          } while (isPositionOccupied(randomX, randomY));
        }

        for (let i = 0; i < targetsPerFormation; i++) {
          const target = document.createElement('a-entity');
          target.setAttribute('gltf-model', '#blueTarget'); // Используйте свою модель мишени
          target.setAttribute('scale', '10 10 10');
          target.setAttribute(
            'animation',
            'property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true;',
          );

          if (formationType === 0) {
            // Горизонтальная формация
            target.setAttribute('position', {
              x: randomX + i * spacing - (targetsPerFormation / 2) * spacing,
              y: randomY,
              z: -15, // Позиция по Z будет равна -15
            });
          } else {
            // Вертикальная формация
            target.setAttribute('position', {
              x: randomX,
              y: randomY + i * spacing - (targetsPerFormation / 2) * spacing,
              z: -15, // Позиция по Z будет равна -15
            });
          }

          target.setAttribute('id', 'target' + currentTargetCount + i);
          target.setAttribute('data-raycastable', '');
          scene.appendChild(target);
        }
      }
    }

    // Создаем первую формацию сразу
    createFormation();

    // Используем setInterval для создания формаций каждые 5 секунд
    const spawnInterval = setInterval(createFormation, 3000);
  },
});
