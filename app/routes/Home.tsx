import Navbar from "components/Navbar";
import Hero from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { useRef, useState } from "react";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [projects, setProjects] = useState<DesignItem[] | null>(null);
  const isCrateingProjectRef= useRef(false)
  return<>

  <div className="home">
  <Navbar/>

  <Hero setProjects={setProjects} isCreatingProjectRef={isCrateingProjectRef} />

  <Projects projects={projects} />


  </div>
  
  </>
}
