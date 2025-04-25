document.addEventListener('DOMContentLoaded', function () {
  // Stress Simulation Script (unchanged)
  let stressLevel = 30;
  let simulationInterval;
  const maxStress = 100;
  const minStress = 0;
  
  function updateStressDisplay() {
    const progressElem = document.getElementById('stress-progress');
    const valueElem = document.getElementById('stress-value');
    const heartRateElem = document.getElementById('heart-rate');
    const oxygenElem = document.getElementById('oxygen');
    
    if (progressElem) progressElem.style.width = stressLevel + '%';
    if (valueElem) valueElem.textContent = Math.round(stressLevel) + '%';
    if (heartRateElem) heartRateElem.textContent = Math.floor(80 + (stressLevel * 0.4));
    if (oxygenElem) oxygenElem.textContent = Math.max(85, 100 - Math.floor(stressLevel * 0.15));
  }
  
  window.startScenario = function () {
    if (!simulationInterval) {
      simulationInterval = setInterval(() => {
        if (stressLevel < maxStress) {
          stressLevel += Math.random() * 1.5;
          updateStressDisplay();
        }
      }, 2000);
    }
  };
  
  window.resetScenario = function () {
    clearInterval(simulationInterval);
    simulationInterval = null;
    stressLevel = 30;
    updateStressDisplay();
  };
  
  window.applyBreathing = function () {
    if (stressLevel > 20) {
      stressLevel = Math.max(minStress, stressLevel - 20);
      updateStressDisplay();
    }
  };
  
  window.findSolution = function () {
    if (stressLevel > 10) {
      stressLevel = Math.max(minStress, stressLevel - 10);
      updateStressDisplay();
    }
  };
  
  updateStressDisplay();

  // --- Optimized 3D Scene Implementation ---
  const scene = new THREE.Scene();
  
  // Precision Camera Setup
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.set(0, 0, 0.001);

  // Transparent Renderer Configuration
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // Optimized Sphere Geometry
  const geometry = new THREE.SphereGeometry(500, 32, 16);
  geometry.scale(-1, 1, 1);

  // Robust Texture Loading System
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    'img/er.png',
    (texture) => {
      console.log('360° Environment Loaded');
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        transparent: true
      });
      scene.add(new THREE.Mesh(geometry, material));
      needsUpdate = true;
    },
    undefined,
    (err) => {
      console.error('Texture Error:', err);
      const material = new THREE.MeshBasicMaterial({
        color: 0x404040,
        side: THREE.BackSide
      });
      scene.add(new THREE.Mesh(geometry, material));
      needsUpdate = true;
    }
  );

  // Interactive Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = -0.25;

  // Adaptive Rendering System
  let needsUpdate = true;
  renderer.setAnimationLoop(() => {
    if (needsUpdate || controls.isRotating) {
      controls.update();
      renderer.render(scene, camera);
      needsUpdate = false;
    }
  });

  // Responsive Layout Handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    needsUpdate = true;
  });

  // Resource Cleanup
  window.addEventListener('beforeunload', () => {
    clearInterval(simulationInterval);
    renderer.dispose();
    controls.dispose();
    textureLoader = null;
  });
});