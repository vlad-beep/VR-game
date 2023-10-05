function turretBlueAnimation() {
  const turretSound = document.querySelector('#turretSound');
  turretSound.components.sound.playSound();
  const turretModel = document.querySelector('#turretBlue');
  turretModel.setAttribute('animation__move', {
    property: 'position',
    to: '0.652 -0.76 -0.380',
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
    to: '0.652 -0.86 -0.213',
    dur: 1200,
    loop: false,
  });
}

function turretBlueRecoil() {
  const turretModel = document.querySelector('#turretBlue');
  turretModel.setAttribute('animation__recoil', {
    property: 'position',
    to: '0.652 -0.76 -0.3',
    dur: 150,
    loop: false,
  });
  setTimeout(() => {
    const turretModel = document.querySelector('#turretBlue');
    turretModel.setAttribute('animation__recoil', {
      property: 'position',
      to: '0.652 -0.76 -0.380',
      dur: 1200,
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
    to: '-0.652 -0.76 -0.380',
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
    to: '-0.652 -0.86 -0.213',
    dur: 1200,
    loop: false,
  });
}

function turretRedRecoil() {
  const turretModel = document.querySelector('#turretRedRed');
  turretModel.setAttribute('animation__recoil', {
    property: 'position',
    to: '-0.652 -0.76 -0.300',
    dur: 150,
    loop: false,
  });
  setTimeout(() => {
    const turretModel = document.querySelector('#turretRedRed');
    turretModel.setAttribute('animation__recoil', {
      property: 'position',
      to: '-0.652 -0.76 -0.380',
      dur: 1500,
      loop: false,
    });
  }, 150);
}
