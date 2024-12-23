import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Launch } from '@/types';

interface GlobeProps {
  launches: Launch[];
  onMarkerClick: (launch: Launch) => void;
}

const Globe = ({ launches, onMarkerClick }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const markersRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 200;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Earth setup
    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);
    const earthTexture = new THREE.TextureLoader().load('/earth-blue-marble.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpScale: 0.5,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(102, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    // Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      earth.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update markers when launches change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old markers
    markersRef.current.forEach((marker) => {
      sceneRef.current?.remove(marker);
    });
    markersRef.current = [];

    // Add new markers
    launches.forEach((launch) => {
      const markerGeometry = new THREE.SphereGeometry(2, 32, 32);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      // Convert lat/long to 3D position
      const lat = launch.latitude * (Math.PI / 180);
      const lon = -launch.longitude * (Math.PI / 180);
      const radius = 102;

      marker.position.x = radius * Math.cos(lat) * Math.cos(lon);
      marker.position.y = radius * Math.sin(lat);
      marker.position.z = radius * Math.cos(lat) * Math.sin(lon);

      sceneRef.current?.add(marker);
      markersRef.current.push(marker);
    });
  }, [launches]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {/* Globe will be rendered here */}
    </div>
  );
};

export default Globe;