import * as THREE from './threejs/three.module.js' 
import { STLLoader } from './threejs/STLLoader.js'
import { ThreeMFLoader } from './threejs/3MFLoader.js';
import { OrbitControls } from './threejs/OrbitControls.js'

let scene, camera, renderer, object, controls, light, animationFrame, model;

// escena 
function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000)

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth/window.innerHeight
    )
    // document.addEventListener('scroll', () => {
    //     camera.position.x += scroll.positionY / 10000000000000
    // })
    camera.position.z = 5

    renderer = new THREE.WebGL1Renderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // let material = new THREE.MeshBasicMaterial({color: 0x00ff00})
    // object = new THREE.Mesh( new THREE.BoxGeometry, material)

    scene.add(object)

    // nuevo modelos 3MFLoader

    let loader2 = new ThreeMFLoader()
    loader2.load('')

    renderer.render(scene, camera)

    controls = new OrbitControls(camera, renderer.domElement)
    console.log(controls.scope)

    light = new THREE.DirectionalLight(0xffffff)
    light.position.set(0, 30, 10)
    scene.add(light)

    animate()
}

function animate() {
    animationFrame = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

let loader = new STLLoader()
loader.load('./3dModels/mandolorian_yoda_3Dee.stl', (_model) => {
    model = _model
    setObjectModel(model)
    init()
})

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

    console.log(1)

    camera.aspect = window.innerWidth / window.innerHeight;
    
    // adjust the FOV
    // camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / windowHeight ) );
    
    camera.updateProjectionMatrix();
    camera.lookAt( scene.position );

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
    object.position.set(1.5, -2, 0)
    
}

function setObjectModel(model){
    object = new THREE.Mesh(
        model,
        new THREE.MeshLambertMaterial({Color: 0x00ff00 }))
    object.scale.set(0.09, 0.09, 0.09)
    object.position.set(1.5, -2, 0)
    object.rotation.x = -Math.PI / 2
}
