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
