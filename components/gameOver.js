function gameOver() {
  const scene = document.querySelector('a-scene');
  const gameOver = document.querySelector('#gameOver');
  const startButton = document.querySelector('#startButton');
  const startButtonText = document.querySelector('#startButtonText');
  let Soundtrack = document.querySelector('#Soundtrack');
  Soundtrack.components.sound.stopSound();
  let gameOverSound = document.querySelector('#gameOverSound');
  gameOverSound.components.sound.playSound();

  clearInterval(hpSpawnInterval);
  clearInterval(shootingTime);
  clearInterval(targetSpawnInterval);
  scene.removeAttribute('spawn-targets');
  scene.removeAttribute('spawn-hp');
  scene.removeAttribute('bullet');

  setTimeout(() => {
    turretRedGameOverAnimation();
    turretBlueGameOverAnimation();
  }, 1000);

  const targets = scene.querySelectorAll('[data-raycastable]');
  targets.forEach((target) => {
    scene.removeChild(target);
  });
  health = maxHealth;
  gameOver.setAttribute('visible', 'true');
  gameOver.setAttribute('animation__move', {
    property: 'position',
    to: '0 2.8 -3.5',
    dur: 2000,
    loop: false,
  });
  setTimeout(() => {
    startButtonText.setAttribute('value', 'RESTART');
    startButton.setAttribute('position', '0 2 -5');
    startButton.setAttribute('visible', 'true');
  }, 2500);
}
