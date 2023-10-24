function gameOver() {
  const scene = document.querySelector('a-scene');
  const gameOver = document.querySelector('#gameOver');
  const startButton = document.querySelector('#startButton');
  const startButtonText = document.querySelector('#startButtonText');
  const scoreFinishBar = document.querySelector('#score-bar-finish');
  const healthBarContainer = document.querySelector('#health-bar-container');
  let bossSound = document.querySelector('#bossSound');
  bossSound.components.sound.stopSound();
  let Soundtrack = document.querySelector('#Soundtrack');
  Soundtrack.components.sound.stopSound();
  let gameOverSound = document.querySelector('#gameOverSound');
  gameOverSound.components.sound.playSound();

  clearInterval(hpSpawnInterval);
  clearInterval(blueTurretShootingInteval);
  clearInterval(redTurretShootingInteval);
  clearInterval(blueTargetSpawnInterval);
  clearInterval(redTargetSpawnInterval);
  scene.removeAttribute('spawn-blue-targets');
  scene.removeAttribute('spawn-red-targets');
  scene.removeAttribute('spawn-boss');
  scene.removeAttribute('spawn-hp');
  scene.removeAttribute('bullet');

  setTimeout(() => {
    turretRedGameOverAnimation();
    turretBlueGameOverAnimation();
  }, 1000);
  healthBarContainer.style.display = 'none';
  const targets = scene.querySelectorAll('[data-raycastable]');
  targets.forEach((target) => {
    scene.removeChild(target);
  });
  health = maxHealth;
  scoreCounter = 0;
  gameOver.setAttribute('text', { value: 'GAME OVER' });
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
    scoreFinishBar.setAttribute('position', '-2 1 -4');
    scoreFinishBar.setAttribute('visible', 'true');
  }, 2500);
}
