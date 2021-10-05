import earthBump from "../assets/8081_earthbump4k.jpg";
import waterTexture from "../assets/waterMap.jpg";
import specTexture from "../assets/earthspec1k.jpg";
import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class Globe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //states
    };
  }

  componentDidMount() {
    const setLocation = (coords) => {
      this.props.setCoords(coords);
    };

    // === THREE.JS CODE START ===
    const scene = new THREE.Scene();
    const canvas = document.querySelector("canvas.webgl");
    /**
     * ++  ++     resize canvas with window     ++  ++
     **/
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * ++  ++     Camera     ++  ++
     **/
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2.25;

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * ++  ++     Objects     ++  ++
     **/

    // Geometry
    const geometry = new THREE.SphereBufferGeometry(1, 64, 64);
    const geometry2 = new THREE.SphereBufferGeometry(1.05, 16, 16);

    // Materials
    const loader = new THREE.TextureLoader();
    const earthMaterial = new THREE.MeshPhysicalMaterial({
      flatShading: true,
      wireframe: false,
      // color: new THREE.Color(0xafafff),
      bumpMap: loader.load(earthBump),
      bumpScale: 0.7,
      envMap: loader.load(specTexture),
      clearcoat: 1,
      // clearcoatRoughnessMap: earthTexture,

      clearcoatRoughness: 0.5,
      reflectivity: 0.7,
    });

    const airMaterial = new THREE.MeshToonMaterial({
      color: new THREE.Color(0xeeeeff),
      wireframe: false,
      transparent: true,
      opacity: 0.15,
      map: loader.load(waterTexture),
    });
    // airMaterial.repeat.set(2, 2);

    // Mesh
    const sphere = new THREE.Mesh(geometry, earthMaterial);
    sphere.name = "sphere";

    const sphere2 = new THREE.Mesh(geometry2, airMaterial);
    sphere.name = "sphere2";

    scene.add(sphere);
    scene.add(sphere2);

    // Lights

    const pointLight = new THREE.PointLight(0xff6000, 0.25);
    pointLight.position.set(7, 2, 17);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x22fed0);
    pointLight2.intensity = 0.15;
    pointLight2.position.set(-9.5, 9, -2.52);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x98d0d8);
    pointLight3.intensity = 0.22;
    pointLight3.position.set(-1.95, -18.24, -10.53);
    scene.add(pointLight3);

    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.23);
    light.intensity = 0.65;
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1.25;
    controls.maxDistance = 3.5;
    controls.zoomSpeed = 0.2;
    controls.panSpeed = 0.2;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    /**
     * ++  ++     Animation     ++  ++
     **/

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      // Update objects
      sphere.rotation.y = 0.02 * elapsedTime;
      sphere2.rotation.y = -0.08 * elapsedTime;
      sphere2.rotation.z = 0.04 * elapsedTime;

      // Update Orbital Controls
      controls.update();
      // Render
      renderer.render(scene, camera);
      // Call animate again on the next frame
      window.requestAnimationFrame(animate);
    };

    animate();

    /**
     * ++  ++     Raycaster     ++  ++
     **/

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersects;
    let pointOfIntersection = new THREE.Vector3();
    const localPoint = new THREE.Vector3();
    const spherical = new THREE.Spherical();
    let lat, lon;

    function onDocumentDblClick(event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      intersects = raycaster.intersectObjects([sphere]);
      if (intersects.length == 0) return;
      pointOfIntersection = intersects[0].point;
      sphere.worldToLocal(localPoint.copy(pointOfIntersection));
      createPoint(localPoint);
    }

    renderer.domElement.addEventListener("dblclick", onDocumentDblClick, false);

    // place marker & get coordinates
    let coords = [];
    function createPoint(position) {
      var point = new THREE.Mesh(
        new THREE.SphereGeometry(0.01, 8, 8),
        new THREE.MeshNormalMaterial({
          flatShading: false,
        })
      );
      point.position.copy(position);

      sphere.add(point);

      spherical.setFromVector3(position);
      lat = THREE.Math.radToDeg(Math.PI / 2 - spherical.phi);
      lon = THREE.Math.radToDeg(spherical.theta) - 90;
      if (lon < -180) {
        lon += 360;
      }

      coords = [lat, lon];
      setLocation(coords);
      // getVideos(coords);
    }
    // === THREE.JS CODE END ===
  }
  render() {
    return (
      <div className="container">
        <canvas className="webgl" ref={(ref) => (this.mount = ref)}></canvas>
      </div>
    );
  }
}

export default Globe;
