import Button from "components/ui/button";
import { ArrowRight, Layers } from "lucide-react";


export default function Hero() {


    return <>


        <section className="hero">
            <div className="announce">
                <div className="dot">
                    <div className="pulse"></div>
                </div>
                <p>Introducing Roomify 2.0</p>
            </div>
            <h1>Build Beautifil spaces at the speed of thought with Roomify</h1>
            <p className="subtitle">Roomify is a AI-first environment that helps you visulaize , render , and ship , architectural projects faster than ever</p>
            <div className="actions">
                <a href="#upload" className="cta">
                    Start Bulding <ArrowRight className="icon" />
                </a>

                <Button variant="outline" size="lg" className="demo">
                    Watch Demo
                </Button>

            </div>

            <div className="upload-shell" id="upload">
                <div className="grid-overlay" />
                <div className="upload-card">
                    <div className="upload-head">
                        <div className="upload-icon">
                            <Layers className="icon" />
                        </div>
                        <h3>Upload your Floor plan</h3>
                        <p>Supports JPG , PWG , formats up tp 10MB</p>
                        <p>Upload Images</p>
                    </div>
                </div>
            </div>
        </section>
    </>
}