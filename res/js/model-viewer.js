import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function initModelViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xcccccc);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);

  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    function (gltf) {
      scene.add(gltf.scene);

      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // Set the initial angles for the camera(radians)
      const initialAngleX = -Math.PI / 10; // Rotate around X axis (pitch angle)
      const initialAngleY = Math.PI / 10; // Rotate around Y axis (yaw angle)
      const initialAngleZ = -Math.PI / 20; // Rotate around Z axis (roll angle)

      // Set the distance factor from the camera to the center of the box
      const distanceFactor = 0.45;

      // According to the initial angle and distance factor, calculate the distance from the camera to the center of the box
      const distance = maxDim * distanceFactor;

      // Use the direction from the camera to the center of the box
      const direction = new THREE.Vector3(0, 0, 1);

      // Create a quaternion representing the initial angles
      const quaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(initialAngleX, initialAngleY, initialAngleZ, "XYZ")
      );

      // Apply the quaternion to the direction vector
      direction.applyQuaternion(quaternion);

      // Set the camera position
      camera.position.copy(center).add(direction.multiplyScalar(distance));

      camera.lookAt(center);
      camera.up.set(0, 1, 0); // Make sure the camera's up is Y axis

      controls.target.copy(center);
      controls.update();

      camera.near = maxDim / 100;
      camera.far = maxDim * 100;
      camera.updateProjectionMatrix();

      controls.minDistance = maxDim * 0.1;
      controls.maxDistance = maxDim * 0.5;
      controls.update();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% Loaded");
    },
    function (error) {
      console.error("Error Occured During Loading the Scene", error);
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener("resize", onWindowResize, false);
}

export { initModelViewer };
