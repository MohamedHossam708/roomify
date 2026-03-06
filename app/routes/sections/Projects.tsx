import { ArrowUpRight, Clock } from 'lucide-react'
import React from 'react'

export const Projects = () => {


  return <>

  <section className="projects">
    <div className="section-inner">
        <div className="section-head">
            <div className="copy">
                <h2>Projects</h2>
                <p>Your latest work and shared community projects , all in one place</p>
            </div>
        </div>

    <div className="projects-grid">
      <div className="project-card  group">
        <div className="preview">
          <img
           src='https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png' 
           alt="Project image" />

           <div className="badge ">
          <span>Community</span>
        </div>
       
        </div>
         <div className="card-body">
          <div>
            <h3>Project New Cairo</h3>

             <div className="meta">
            <Clock size={12}/>
            <span>{new Date('03/03/2026').toLocaleDateString()} </span>
            <span>By Mohamed Hossam</span>
          </div>
          </div>
         <div className="arrow">
              <ArrowUpRight size={18}/>
            </div>
        </div>
      </div>
    </div>
    </div>

  </section>
  </>
}
