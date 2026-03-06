import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import { ArrowRight, Layers } from "lucide-react";
import Button from "components/ui/button";
import Hero from "./sections/Hero";
import { Projects } from "./sections/Projects";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return<>

  <div className="home">
  <Navbar/>

  <Hero />

  <Projects />


  </div>
  
  </>
}
