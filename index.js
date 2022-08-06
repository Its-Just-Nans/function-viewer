import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
const sanitizeFormula = (value) => {
    value = value.replace(/([^A-Za-z]|^)x([^A-Za-z]|$)/g, "$1oneMesh.position.x$2");
    value = value.replace(/([^A-Za-z]|^)y([^A-Za-z]|$)/g, "$1oneMesh.position.y$2");
    value = value.replace(/([^A-Za-z]|^)z([^A-Za-z]|$)/g, "$1oneMesh.position.z$2");
    return value;
};
let camera, scene, renderer;
let axesHelper, controls;
let x_deplacement = -100;
let meshes = [];
let boolean = true;
let myMESH, myMESH2;
let dateEnd;
let formula = sanitizeFormula(document.getElementById("formula").value);
let deplacement = parseFloat(document.getElementById("deplacement").value);
let rapport = parseFloat(document.getElementById("rapport").value);
let reset = false;
init();
animate();
document.getElementById("more").addEventListener("click", (event) => {
    const element = document.getElementById("details");
    if (element.style.display == "none") {
        event.target.innerHTML = "Less";
        element.style.display = "block";
    } else {
        event.target.innerHTML = "More";
        element.style.display = "none";
    }
});
function init() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(50, 50, 50);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    let z = 0;
    let y = 0;
    let x = 0;
    const line = 10;
    const largeur = 1;
    for (let count = 0, max = line * line; count < max; count++) {
        const geometry = new THREE.BoxGeometry(largeur, largeur, largeur);
        const material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(
            `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                Math.random() * 256
            )})`
        );
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        meshes.push(mesh);
    }
    meshes.forEach((oneMesh, index) => {
        oneMesh.position.x = oneMesh.position.x - rapport * index;
    });
    const mesh1 = new THREE.Mesh(
        new THREE.BoxGeometry(largeur, largeur, largeur),
        new THREE.MeshBasicMaterial({ color: "green" })
    );
    mesh1.position.y = 20;
    scene.add(mesh1);
    const mesh2 = new THREE.Mesh(
        new THREE.BoxGeometry(largeur, largeur, largeur),
        new THREE.MeshBasicMaterial({ color: "red" })
    );
    mesh2.position.x = 20;
    scene.add(mesh2);
    const mesh3 = new THREE.Mesh(
        new THREE.BoxGeometry(largeur, largeur, largeur),
        new THREE.MeshBasicMaterial({ color: "blue" })
    );
    mesh3.position.z = 20;
    scene.add(mesh3);

    axesHelper = new THREE.AxesHelper(10000);
    scene.add(axesHelper);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

setInterval(() => {
    console.log(formula);
}, 1000);
function animate() {
    requestAnimationFrame(animate);
    if (boolean == true) {
        const longeurMax = 100;
        meshes.forEach((oneMesh, index) => {
            if (oneMesh.position.x > longeurMax) {
                oneMesh.position.x = -longeurMax;
            } else {
                oneMesh.position.x = oneMesh.position.x + deplacement;
            }
            try {
                oneMesh.position.y = eval(formula);
            } catch (e) {
                console.log("e", e);
                oneMesh.position.y = oneMesh.position.x;
            }
        });
    }
    controls.update();
    renderer.render(scene, camera);
}

document.getElementsByTagName("canvas")[0].addEventListener("keypress", () => {
    boolean = !boolean;
});
document.getElementById("formula").addEventListener("input", (event) => {
    formula = sanitizeFormula(event.target.value);
});
document.getElementById("pause").addEventListener("click", (event) => {
    if (event.target.innerHTML == "Pause") {
        event.target.innerHTML = "Play";
    } else {
        event.target.innerHTML = "Pause";
    }
    boolean = !boolean;
});
document.getElementById("deplacement").addEventListener("input", (event) => {
    deplacement = parseFloat(event.target.value);
});
document.getElementById("rapport").addEventListener("input", (event) => {
    rapport = parseFloat(event.target.value);
    meshes.forEach((oneMesh, index) => {
        oneMesh.position.x = 0 - rapport * index;
    });
});
