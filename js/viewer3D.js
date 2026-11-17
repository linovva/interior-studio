import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene;
let camera;
let renderer;
let controls;

export async function init3DViewer(project){
    // Сцена
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Модель
    const loader = new GLTFLoader();
    const model = await loader.loadAsync(project.model3D);
    scene.add(model.scene);

    // Рендер
    renderer = new THREE.WebGLRenderer();
    const viewer = document.getElementById('modelViewer');
    viewer.appendChild(renderer.domElement);
    const width = viewer.clientWidth;
    const height = viewer.clientHeight;
    renderer.setSize(width, height);

    // Камера
    camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.set(0,2,2);

    // Контролс
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true;
    const box = new THREE.Box3().setFromObject(model.scene);
    const center = box.getCenter(new THREE.Vector3());
    controls.target.copy(center);
    controls.cursor.copy(center);
    controls.maxTargetRadius = 2;
    controls.maxDistance = 4;
    controls.minDistance = 0.5;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI * 3 / 4;
};

let animationId;

export function startRendering(){
    if(animationId != null) return;

    function animate(){
        controls.update();
        renderer.render(scene, camera);

        animationId = requestAnimationFrame(animate);
    }

    animate();
}

export function stopRendering(){
    if (animationId === null) return;

    cancelAnimationFrame(animationId);
    animationId = null;
}