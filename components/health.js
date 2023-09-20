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
        z: -15, // Позиция по Z будет равна 0
      });

      // Устанавливаем начальный масштаб 0 (мишень невидима)
      hp.setAttribute('scale', '0 0 0');

      // Добавляем анимацию увеличения масштаба
      hp.setAttribute('animation__scale', {
        property: 'scale',
        to: '0.8 0.8 0.8',
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
