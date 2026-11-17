import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene;
let camera;
let renderer;
let controls;

export async function initPanoramaViewer(project){
    // Сцена
    scene = new THREE.Scene();

    // Сфера
    const geometry = new THREE.SphereGeometry(100, 64, 32);
    const loader = new THREE.TextureLoader();
    const texture = await loader.loadAsync(project.panoramas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Рендерер
    renderer = new THREE.WebGLRenderer();
    const viewer = document.getElementById('panoramaViewer');
    viewer.appendChild(renderer.domElement);
    const width = viewer.clientWidth;
    const height = viewer.clientHeight;
    renderer.setSize(width, height);

    // Камера
    camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 3000);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.set(0,0,0.01);

    // Контролс
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI * 3 / 4;
}

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