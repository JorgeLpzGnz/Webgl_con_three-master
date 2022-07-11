import * as THREE from "./threejs/three.module.js";

import { GLTFLoader } from "./threejs/GLTFLoader.js";
import * as SkeletonUtils from "./threejs/SkeletonUtils.js";
import { OrbitControls } from './threejs/OrbitControls.js'

let camera, scene, renderer;
let clock, model3, camaraFocus;

const mixers = [];

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camaraFocus = 1.5
  camera.position.set(1.2, 2, 1);
  camera.lookAt(0, camaraFocus, 0);

  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000);
  // scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

  const hemiLight = new THREE.DirectionalLight(0xffffff);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  // const dirLight = new THREE.DirectionalLight(0xffffff);
  // dirLight.position.set(-3, 10, -10);
  // dirLight.castShadow = true;
  // dirLight.shadow.camera.top = 10;
  // dirLight.shadow.camera.bottom = -10;
  // dirLight.shadow.camera.left = -10;
  // dirLight.shadow.camera.right = 5;
  // dirLight.shadow.camera.near = 0.1;
  // dirLight.shadow.camera.far = 40;
  // scene.add(dirLight);

  // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

  // ground

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshPhongMaterial({ color: 0x000, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const loader = new GLTFLoader();
  loader.load("./3dModels/Soldier.glb", function (gltf) {
    gltf.scene.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    // const model1 = SkeletonUtils.clone(gltf.scene);
    // const model2 = SkeletonUtils.clone(gltf.scene);
    model3 = SkeletonUtils.clone(gltf.scene);

    // const mixer1 = new THREE.AnimationMixer(model1);
    // const mixer2 = new THREE.AnimationMixer(model2);
    const mixer3 = new THREE.AnimationMixer(model3);

    // mixer1.clipAction(gltf.animations[0]).play(); // idle
    // mixer2.clipAction(gltf.animations[1]).play(); // run
    mixer3.clipAction(gltf.animations[3]).play(); // walk

    // model1.position.x = -2;
    // model2.position.x = 0;
    model3.position.x = 0;
    model3.rotation.y = 4

    scene.add(model3);
    mixers.push(mixer3);
    window.addEventListener('wheel', handleScroll)
    animate();
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);



  // const controls = new OrbitControls(camera, renderer.domElement)
  // controls.maxZoom = 20

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

function handleScroll( event ){
  if(event.deltaY < 0 && camera.position.y < 2) {
    model3.rotation.y += 0.1
    camera.position.y += 0.01
    camaraFocus += 0.01
    camera.lookAt(0, camaraFocus, 0);
}
if(event.deltaY > 0 && camera.position.y > 0.75) {
    model3.rotation.y -= 0.1
    camera.position.y -= 0.01
    console.log(camera.position.y)
    camaraFocus -= 0.01
    camera.lookAt(0, camaraFocus, 0);
}
}
