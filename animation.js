import * as THREE from "./threejs/three.module.js";
import { GLTFLoader } from "./threejs/GLTFLoader.js";
import { Water } from "./threejs/Water.js";
import { RectAreaLightHelper } from "./threejs/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "./threejs/RectAreaLightUniformsLib.js";
import { Lensflare, LensflareElement } from "./threejs/Lensflare.js";
import { OrbitControls } from "./threejs/OrbitControls.js";

let camera, scene, renderer, modelRotationValue, cameraYPosition;
let clock, model3, water;

let scrollValue = window.scrollY;
modelRotationValue = -scrollValue / 1000;
if (modelRotationValue > -6.5) {
  modelRotationValue = -scrollValue / 1000;
  cameraYPosition = -scrollValue / 5000 + 1.5;
} else {
  modelRotationValue = -6.5;
  cameraYPosition = 0.2;
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

  // track of time

  clock = new THREE.Clock();

  // scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000);
  // scene.fog = new THREE.Fog(0x000, 1, 4)
  // addWater()

  addFloor(0x495057);

  // add ligths

  // //Set up shadow properties for the light
  // light.shadow.mapSize.width = 1000; // default
  // light.shadow.mapSize.height = 1000; // default
  // light.shadow.camera.near = 0.5; // default
  // light.shadow.camera.far = 500; //

  // add Rect Ligth params:
  // [ color, intensity, positionX, positionY, positionZ, lookAtXPosition, lookAtYPosition, lookAtZPosition, ]

  addRectLight(0x868e96, 10, 1, 2, -1, 1, 0, 0, 1, 0);
  addRectLight(0xffffff, 100, 1, 0.1, 1, 2, 0, 0, 1, 0);

  // addPointerLight(0.9, 1.2, 0.9);
  // addPointerLight(-0.9, 1.2, -0.9);
  // addPointerLight(0, 1, 1, 0.5);

  // add model

  addGltfModel();

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
  if (water) {
    render();
  }
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  for (const mixer of mixers) mixer.update(delta);
  renderer.render(scene, camera);
}

function handleScroll() {
  modelRotationValue = -window.scrollY / 1000;
  cameraYPosition = -window.scrollY / 5000 + 1.7;
  let cameraZPosition = -Math.cos(Math.sin(window.scrollY / 1000) + 1.5);

  if (modelRotationValue > -6.5) {
    model3.rotation.y = modelRotationValue;
    camera.position.y = cameraYPosition;
    camera.lookAt(0, cameraYPosition, 0);
    camera.position.z = cameraZPosition;
  }
}

function addFBXModel() {
  const loader = new FBXLoader();
  loader.load("models/fbx/Samba Dancing.fbx", function (object) {
    mixer = new THREE.AnimationMixer(object);

    const action = mixer.clipAction(object.animations[0]);
    action.play();

    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(object);
  });
}

function addGltfModel() {
  const loader = new GLTFLoader();

  loader.load("./3dModels/Soldier.glb", function (gltf) {
    gltf.scene.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    // model

    model3 = gltf.scene;
    model3.receiveShadow = true;
    model3.castShadow = true;

    // animation

    const mixer3 = new THREE.AnimationMixer(model3);
    mixer3.clipAction(gltf.animations[3]).play(); // walk

    // position

    model3.position.x = 0;
    model3.rotation.y = modelRotationValue;
    model3.position.y = 0;
    scene.add(model3);
    mixers.push(mixer3);
    window.addEventListener("scroll", handleScroll);
    animate();
  });
}

function addPointerLight(x, y, z) {
  // ligths

  const light = new THREE.PointLight(0xffffff);

  // postion

  light.position.set(x, y, z);

  // ligth texture

  const textureLoader = new THREE.TextureLoader();
  const textureFlare0 = textureLoader.load("./img/textures/ligth.png");
  const lensflare = new Lensflare();
  lensflare.addElement(new LensflareElement(textureFlare0, 512, 0));

  light.add(lensflare);
  light.intensity = 0.2;

  // put on the scene
  scene.add(light);
}

function addRectLight(
  color,
  intensity,
  width,
  height,
  positionX,
  positionY,
  positionZ,
  lookAtX,
  lookAtY,
  lookAtZ
) {
  RectAreaLightUniformsLib.init();

  const rectLight = new THREE.RectAreaLight(color, intensity, width, height);
  rectLight.position.set(positionX, positionY, positionZ);
  rectLight.lookAt(lookAtX, lookAtY, lookAtZ);
  scene.add(rectLight);
  rectLight.add(new RectAreaLightHelper(rectLight));
}

function addWater() {
  const waterGeometry = new THREE.PlaneGeometry(200, 200);

  water = new Water(waterGeometry, {
    textureWidth: 50,
    textureHeight: 50,
    waterNormals: new THREE.TextureLoader().load(
      "./threejs/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    waterColor: 0x001e0f,
    distortionScale: 1,
    fog: scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.1;

  scene.add(water);
}

function addFloor(color) {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(2000, 0.1, 2000),
    new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0,
      metalness: 1,
    })
  );
  const ldrUrls = ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"];
  const texture = new THREE.CubeTextureLoader()
    .setPath("./img/textures/pisa/")
    .load(ldrUrls);
  floor.material.envMap = texture;
  scene.add(floor);
}

function render() {
  water.material.uniforms["time"].value += 2.0 / 600;

  renderer.render(scene, camera);
}

init();
animate();
