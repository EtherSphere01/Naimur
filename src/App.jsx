import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import StarCanvas from "./components/canvas/Stars";
import { AnimatePresence } from "framer-motion";
import Education from "./components/sections/Education";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Footer from "./components/sections/Footer";
import ProjectDetails from "./components/Dialog/ProjectDetails";
import { useEffect, useState, Suspense, lazy, useCallback } from "react";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

// Lazy load the Contact component since it contains the heavy Earth 3D model
const Contact = lazy(() => import("./components/sections/Contact"));

const Body = styled.div`
    background-color: ${({ theme }) => theme.bg};
    width: 100%;
    overflow-x: hidden;
    position: relative;
`;

const Wrapper = styled.div`
    padding-bottom: 100px;
    background: linear-gradient(
            38.73deg,
            rgba(204, 0, 187, 0.15) 0%,
            rgba(201, 32, 184, 0) 50%
        ),
        linear-gradient(
            141.27deg,
            rgba(0, 70, 209, 0) 50%,
            rgba(0, 70, 209, 0.15) 100%
        );
    width: 100%;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

// Loading fallback component for lazy-loaded sections
const SectionLoader = () => (
    <div
        style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <div style={{ color: "#fff", fontSize: "1rem" }}>Loading...</div>
    </div>
);

function App() {
    const [openModal, setOpenModal] = useState({ state: false, project: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Memoize modal handlers to prevent unnecessary re-renders
    const handleSetOpenModal = useCallback((value) => {
        setOpenModal(value);
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            {loading ? (
                <LoadingScreen />
            ) : (
                <Body>
                    <BrowserRouter>
                        <Navbar />
                        <StarCanvas />
                        <AnimatePresence>
                            <div>
                                <Hero />
                                <Wrapper>
                                    <Skills />
                                    <Experience />
                                </Wrapper>
                                <Projects
                                    openModal={openModal}
                                    setOpenModal={handleSetOpenModal}
                                />
                                <Wrapper>
                                    <Education />
                                    <Suspense fallback={<SectionLoader />}>
                                        <Contact />
                                    </Suspense>
                                </Wrapper>
                                <Footer />
                                {openModal.state && (
                                    <ProjectDetails
                                        openModal={openModal}
                                        setOpenModal={handleSetOpenModal}
                                    />
                                )}
                            </div>
                        </AnimatePresence>
                    </BrowserRouter>
                </Body>
            )}
        </ThemeProvider>
    );
}
export default App;
