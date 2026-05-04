import Button from 'components/ui/button'
import { generate3DView } from 'lib/ai.action'
import { createProject, getProjectById } from 'lib/puter.actions'
import { Box, Download, RefreshCcw, Share2, X } from 'lucide-react'
import { use, useEffect, useRef, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { useLocation, useLoaderData, useNavigate, useParams, useOutlet, useOutletContext } from 'react-router'




const Visualizer = () => {
///////////////////////////////////////////////////////////////////////////////////////
    const navigate = useNavigate()
    const location = useLocation()
       const { id } = useParams() as { id: string }
    const {userId}=useOutletContext<AuthContext>()
    const hasInitialGenrated = useRef(false)

////////////////////////////////////////////////////////////////////////////////////////
    // project data state 
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [project ,setProject] = useState<DesignItem | null>(null)
    const [isProjectLoading ,setIsProjectLoading] = useState(true)

    
 

    const handelBack = () => {
        navigate("/")
    }

    const handleExport = () => {
        if (!currentImage) return;
        const link = document.createElement('a');
        link.href = currentImage;
        link.download = `roomify-export-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const runGeneration = async (item:DesignItem) => {
        if (!id || !item.sourceImage) return
        try {

            setIsProcessing(true)

            const result = await generate3DView({ sourceImage: item.sourceImage })

            if (result.renderedImage) {
                setCurrentImage(result.renderedImage)
                
                const updatedItem ={
                    ...item,
                    renderedImage:result.renderedImage,
                    renderdPath:result.renderdPath,
                    updatedAt:new Date(),
                    ownerId:item.ownerId ?? userId ?? null,
                    isPublic:item.isPublic

                }

                const saved = await createProject({item:updatedItem , visibility:'private'})

                if(saved){
                    setProject(saved)
                    setCurrentImage(saved.renderedImage || result.renderedImage)
                }

            }


        } catch (error) {
            console.log('Generation Faild', error)
        } finally {
            setIsProcessing(false)
        }
    }

    useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }

      setIsProjectLoading(true);

      const fetchedProject = await getProjectById({ id });

      if (!isMounted) return;

      setProject(fetchedProject);
      setCurrentImage(fetchedProject?.renderedImage || null);
      setIsProjectLoading(false);
      hasInitialGenrated.current = false;
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (
      isProjectLoading ||
      hasInitialGenrated.current ||
      !project?.sourceImage
    )
      return;

    if (project.renderedImage) {
      setCurrentImage(project.renderedImage);
      hasInitialGenrated.current = true;
      return;
    }

    hasInitialGenrated.current = true;
    void runGeneration(project);
  }, [project, isProjectLoading]);

    return (

        <div className="visualizer">
            <nav className='topbar'>
                <div className='brand'>
                    <Box className='logo' />
                    <span className="name">Roomify</span>
                </div>
                <Button variant='ghost' size='sm' onClick={handelBack} className='exit'>
                    <X className='icon' /> Exit editor

                </Button>
            </nav>

            <section className="content">
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-meta">
                            <p>Project</p>
                            <h2>{project?.name || `Residence ${id}`}</h2>
                            <p className="note">Created by you</p>

                        </div>


                        <div className="panel-actions"> 
                            <Button
                            size="sm"
                            className="export"
                            onClick={handleExport}
                            disabled={!currentImage}
                            >
                                <Download className="w-4 h-4 mr-2"/>
                                Export
                            </Button>

                              <Button
                            size="sm"
                            className="share"
                            onClick={()=>{}}
                            >
                                <Share2 className="w-4 h-4 mr-2"/>
                                Share
                            </Button>
                        </div>
                    </div>

                    <div className={`render-area ${isProcessing ? 'is-processing':''}`}>
                        {currentImage ? (
                            <img src={currentImage} alt="Ai Rendered " className="render-img" />
                        ):(
                            <div className="render-placeholder">
                                {project?.sourceImage && (
                                    <img src={project?.sourceImage} alt="original image" className="render-fallback" />
                                )}
                            </div>
                        )}

                        {isProcessing && (
                            <div className='render-overlay'>
                                <div className="rendering-card">
                                 <RefreshCcw className='spinner'/>
                                 <div className="title"> Rendering ... </div>
                                 <div className="subtitle"> Generating your 3D Visualization</div>
                                </div>
                            </div>
                        )}
                    </div>


                </div>

                <div className="panel compare">
                    <div className="panel-header">
                        <div className="panel-meta">
                            <p>Comparison</p>
                            <h3>Before and After</h3>
                        </div>
                        <div className="hint">Drag to Compare</div>
                    </div>
                    <div className="compare-stage">
                        {project?.sourceImage && currentImage ?(
                            <ReactCompareSlider
                            defaultValue={50}
                            style={{width:'100%' , height:'auto' }}
                            itemOne={
                                <ReactCompareSliderImage src={project?.sourceImage} alt='Before' className='compare-img' />
                            }
                             itemTwo={
                                <ReactCompareSliderImage src={currentImage || project?.renderedImage || ''} alt='After' className='compare-img' />
                            }
                        
                        />
                        ):(
                            <div className="compare-fallback">
                                {project?.sourceImage && (
                                    <img src={project?.sourceImage} alt="Before" className='compare-img' />
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </section>

        </div>

    )
}

export default Visualizer
