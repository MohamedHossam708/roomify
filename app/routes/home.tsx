import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import Hero from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [projects, setProjects] = useState<DesignItem[] | null>(null);
  
  return<>

  <div className="home">
  <Navbar/>

  <Hero setProjects={setProjects} />

  <Projects projects={projects} />


  </div>
  
  </>
}
