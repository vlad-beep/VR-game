function turretBlueAnimation() {
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

function turretBlueGameOverAnimation() {
  const turretSound = document.querySelector('#turretSound');
  turretSound.components.sound.playSound();
  const turretModel = document.querySelector('#turretBlue');
  turretModel.setAttribute('animation__move', {
    property: 'position',
    to: '0.652 -1.05 -0.380',
    dur: 1200,
    loop: false,
  });
}

function turretBlueRecoil() {
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

function turretRedAnimation() {
  const turretSound = document.querySelector('#turretSound');
  turretSound.components.sound.playSound();
  const turretModel = document.querySelector('#turretRedRed');
  turretModel.setAttribute('animation__move', {
    property: 'position',
    to: '-0.56 -0.52 -0.457',
    dur: 1200,
    loop: false,
  });
}

function turretRedGameOverAnimation() {
  const turretSound = document.querySelector('#turretSound');
  turretSound.components.sound.playSound();
  const turretModel = document.querySelector('#turretRedRed');
  turretModel.setAttribute('animation__move', {
    property: 'position',
    to: '-0.56 -0.554 0.206',
    dur: 1200,
    loop: false,
  });
}

function turretRedRecoil() {
  const turretModel = document.querySelector('#turretRed');
  turretModel.setAttribute('animation__recoil', {
    property: 'position',
    to: '0.652 -0.96 -0.587',
    dur: 150,
    loop: false,
  });
  setTimeout(() => {
    const turretModel = document.querySelector('#turretRed');
    turretModel.setAttribute('animation__recoil', {
      property: 'position',
      to: '0.652 -0.967 -0.646',
      dur: 1500,
      loop: false,
    });
  }, 150);
}
