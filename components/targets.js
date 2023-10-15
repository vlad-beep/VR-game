let blueTargetSpawnInterval;
AFRAME.registerComponent('spawn-blue-targets', {
  init: function () {
    const scene = this.el;
    const maxTargets = 30;
    const spacing = 2;
    const targetsPerFormation = 4;

    function countTargets() {
      const targets = scene.querySelectorAll('[data-raycastable]');
      return targets.length;
    }

    function isPositionOccupied(x, y, formationType) {
      let positions = [];
      for (let i = 0; i < targetsPerFormation; i++) {
        if (formationType === 0) {
          formationElx = x + i * spacing - (targetsPerFormation / 2) * spacing;
          formationEly = y;
          positions.push({ x: formationElx, y: formationEly });
        } else {
          formationElx = x;
          formationEly = y + i * spacing - (targetsPerFormation / 2) * spacing;
          positions.push({ x: formationElx, y: formationEly });
        }
      }
      const targets = scene.querySelectorAll('[data-raycastable]');
      for (const target of targets) {
        const position = target.getAttribute('position');
        const targetX = position.x;
        const targetY = position.y;
        for (let i = 0; i < positions.length; i++) {
          let distance = Math.sqrt(
            Math.pow(positions[i].x - targetX, 2) + Math.pow(positions[i].y - targetY, 2),
          );
          if (distance < spacing) {
            return true;
          }
        }
      }
      return false;
    }

    function createFormation() {
      const currentTargetCount = countTargets();

      if (currentTargetCount < maxTargets) {
        const formationType = Math.floor(Math.random() * 2);

        let randomX, randomY;

        if (formationType === 0) {
          do {
            randomX = Math.random() * 16 - 8;
            randomY = Math.random() * 20 - 10;
          } while (isPositionOccupied(randomX, randomY, formationType));
        } else {
          do {
            randomX = Math.random() * 20 - 10;
            randomY = Math.random() * 16 - 8;
          } while (isPositionOccupied(randomX, randomY, formationType));
        }
        for (let i = 0; i < targetsPerFormation; i++) {
          const target = document.createElement('a-entity');
          target.setAttribute('gltf-model', '#blueTarget');
          target.setAttribute('scale', '10 10 10');
          target.setAttribute(
            'animation',
            'property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true;',
          );

          if (formationType === 0) {
            target.setAttribute('position', {
              x: randomX + i * spacing - (targetsPerFormation / 2) * spacing,
              y: randomY,
              z: -15,
            });
          } else {
            target.setAttribute('position', {
              x: randomX,
              y: randomY + i * spacing - (targetsPerFormation / 2) * spacing,
              z: -15,
            });
          }

          target.setAttribute('id', 'target' + currentTargetCount + i);
          target.setAttribute('data-raycastable', '');
          scene.appendChild(target);
        }
      }
    }
    createFormation();
    blueTargetSpawnInterval = setInterval(createFormation, 3000);
  },
});
