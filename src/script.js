import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';

// Texture
const loader = new THREE.TextureLoader();
const heightTexture = loader.load('height.png');
const texture = loader.load('/texture.jpg');
const alphaTexture = loader.load('/alpha.png');

// Debug
const gui = new dat.GUI({
  closed: true
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64);

// Materials
const material = new THREE.MeshStandardMaterial({
  color: 'gray',
  map: texture,
  displacementMap: heightTexture,
  displacementScale: 0.6,
  transparent: true,
  alphaMap: alphaTexture,
  depthTest: false
});

// Mesh
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
plane.rotation.x = 181;

gui.add(plane.rotation, 'x').min(0).max(500);

// Lights

const pointLight = new THREE.PointLight('#00b3ff', 3);
pointLight.position.x = 0.2;
pointLight.position.y = 10;
pointLight.position.z = 4.4;
scene.add(pointLight);

gui.add(pointLight.position, 'x');
gui.add(pointLight.position, 'y');
gui.add(pointLight.position, 'z');

const col = { color: '#00b3ff' };

gui.addColor(col, 'color').onChange(() => {
  pointLight.color.set(col.color);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth * 0.7,
  height: window.innerHeight
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth * 0.7;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

document.addEventListener('mousemove', animateterrain);

let mouseY = 0;

function animateterrain(event) {
  mouseY = event.clientY;
}

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  plane.rotation.z = 0.5 * elapsedTime;
  plane.material.displacementScale = 0.3 + mouseY * 0.0008;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
