import * as THREE from "./threejs/three.module.js";
import { GLTFLoader } from "./threejs/GLTFLoader.js";
import * as SkeletonUtils from "./threejs/SkeletonUtils.js";
import { Lensflare, LensflareElement } from "./threejs/Lensflare.js";
import { OrbitControls } from "./threejs/OrbitControls.js";

let camera, scene, renderer, modelRotationValue, cameraYPosition;
let clock, model3;

let scrollValue = window.scrollY;
modelRotationValue = -scrollValue / 1000;
if (modelRotationValue > -6.5) {
  modelRotationValue = -scrollValue / 1000;
  cameraYPosition = -scrollValue / 5000;
} else {
  modelRotationValue = -6.5;
  cameraYPosition = -1.3;
}

const mixers = [];

function init() {

  // camera

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(1.2, cameraYPosition, 2);
  camera.lookAt(0, cameraYPosition, 0);
  console.lo

  // track of time

  clock = new THREE.Clock();

  // scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000);

  // ground

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshPhongMaterial({ color: 0x000, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // add ligths

  addPointerLight( 0.9, 0.2 , 0.9 )
  addPointerLight( -0.9, 0.2 , -0.9 )
  addPointerLight( 0,1, -0.1 , 0.5 )

  // add model

  addGltfModel()

  // render

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  for (const mixer of mixers) mixer.update(delta);
  renderer.render(scene, camera);

}

function handleScroll() {

  modelRotationValue = -window.scrollY / 1000;
  cameraYPosition = -window.scrollY / 5000;

  if (modelRotationValue > -6.5) {
    model3.rotation.y = modelRotationValue;
    camera.position.y = cameraYPosition;
    camera.lookAt(0, cameraYPosition, 0);
  }

}

function addGltfModel() {

  const loader = new GLTFLoader();

  loader.load("./3dModels/Soldier.glb", function (gltf) {

    gltf.scene.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    // model

    model3 = gltf.scene;

    // animation

    const mixer3 = new THREE.AnimationMixer(model3);
    mixer3.clipAction(gltf.animations[3]).play(); // walk

    // position

    model3.position.x = 0;
    model3.rotation.y = modelRotationValue;
    model3.position.y = -1.5;
    scene.add(model3);
    mixers.push(mixer3);
    window.addEventListener("scroll", handleScroll);
    animate();

  });
}

function addPointerLight( x, y, z ) {

  // ligths 

  const light = new THREE.PointLight(0xffffff);

  // postion

  light.position.set( x , y, z );

  // ligth texture

  const textureLoader = new THREE.TextureLoader();
  const textureFlare0 = textureLoader.load("./img/textures/ligth.png");
  const lensflare = new Lensflare();
  lensflare.addElement(new LensflareElement(textureFlare0, 512, 0));

  light.add(lensflare);

  // put on the scene
  scene.add(light);

}

init();
animate();