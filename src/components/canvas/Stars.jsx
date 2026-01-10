import React, { useRef, useState, Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import styled from "styled-components";

const StyledCanvasWrapper = styled.div`
    width: 100%;
    height: auto;
    position: absolute;
    inset: 0;
`;

const Stars = (props) => {
    const ref = useRef();
    // Reduced from 5000 to 1500 points for better performance
    const sphere = useMemo(
        () => random.inSphere(new Float32Array(1500), { radius: 1.2 }),
        []
    );

    useFrame((state, delta) => {
        if (ref.current) {
            // Reduced rotation speed for smoother animation
            ref.current.rotation.x -= delta / 15;
            ref.current.rotation.y -= delta / 20;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points
                ref={ref}
                positions={sphere}
                stride={3}
                frustumCulled
                {...props}
            >
                <PointMaterial
                    transparent
                    color="#f272c8"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const StyledStarsCanvas = () => {
    const [isVisible, setIsVisible] = useState(true);

    // Cleanup on unmount
    useEffect(() => {
        return () => setIsVisible(false);
    }, []);

    if (!isVisible) return null;

    return (
        <StyledCanvasWrapper>
            <Canvas
                camera={{ position: [0, 0, 1] }}
                dpr={[1, 1.5]} // Limit device pixel ratio
                gl={{
                    antialias: false, // Disable for better performance
                    powerPreference: "high-performance",
                }}
                frameloop="demand" // Only render when needed
            >
                <Suspense fallback={null}>{/* <Stars /> */}</Suspense>
                <Preload all />
            </Canvas>
        </StyledCanvasWrapper>
    );
};

export default StyledStarsCanvas;
