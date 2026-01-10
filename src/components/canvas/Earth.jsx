import React, { Suspense, useEffect, useState, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

const Earth = memo(() => {
    const earth = useGLTF("./planet/scene.gltf");
    return (
        <primitive
            object={earth.scene}
            scale={2.5}
            position-y={0}
            rotation-y={0}
        />
    );
});

Earth.displayName = "Earth";

const EarthCanvas = () => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        // Only load the 3D model when the component is in view
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const target = document.getElementById("Contact");
        if (target) observer.observe(target);

        return () => observer.disconnect();
    }, []);

    if (!isInView) {
        return <div style={{ width: "100%", height: "350px" }} />;
    }

    return (
        <Canvas
            shadows
            frameloop="demand"
            dpr={[1, 1.5]}
            gl={{
                preserveDrawingBuffer: true,
                antialias: false,
                powerPreference: "high-performance",
            }}
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [-4, 3, 6],
            }}
            style={{ height: "350px" }}
        >
            <Suspense fallback={null}>
                <OrbitControls
                    autoRotate
                    autoRotateSpeed={0.5}
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
                <Earth />
                <Preload all />
            </Suspense>
        </Canvas>
    );
};

// Preload the GLTF model
useGLTF.preload("./planet/scene.gltf");

export default memo(EarthCanvas);
