AFRAME.registerComponent('shooter', {
  init: function () {
    const el = this.el;
    const cursor = document.querySelector('a-cursor');

    // Обработчик нажатия клавиши "Пробел"
    window.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        console.log('shot');
        const direction = cursor.getAttribute('raycaster').direction;
        const origin = cursor.getAttribute('raycaster').origin;

        // Создаем луч для определения пересечения
        const raycaster = new THREE.Raycaster(origin, direction);
        const intersects = raycaster.intersectObjects(el.sceneEl.object3D.children, true);

        if (intersects.length > 0) {
          // Если луч пересек объекты
          const target = intersects[0].object;

          // Создаем пулю (голубой луч)
          const bullet = document.createElement('a-entity');
          bullet.setAttribute('geometry', {
            primitive: 'cylinder',
            height: 0.1,
            radius: 0.01,
          });
          bullet.setAttribute('material', 'color: blue');
          bullet.setAttribute('position', origin);
          bullet.setAttribute('rotation', '0 0 0');

          // Добавляем пулю в сцену
          el.sceneEl.appendChild(bullet);

          // Здесь можно добавить логику для движения пули и обработки попадания
          console.log('Пуля выпущена в', direction);
        }
      }
    });
  },
});
