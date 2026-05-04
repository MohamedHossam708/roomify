import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from '../lib/constants'
import { createProject, getProjects } from 'lib/puter.actions'

interface UploadProps {
    setProjects: React.Dispatch<React.SetStateAction<DesignItem[] | null>>;
    isCreatingRef: React.MutableRefObject<boolean>
}

export const Upload = ({ setProjects , isCreatingRef}: UploadProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [progress, setProgress] = useState(0)
    const { isSignedIn } = useOutletContext<AuthContext>()

    const navigate = useNavigate()
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

   

    const handelUploadComplete = async (base64: string) => {
        try {
            if(isCreatingRef.current) return false
        isCreatingRef.current=true
        const newId = Date.now().toString()
        const name =`Residence ${newId}`

         const newItem = {
            id: newId,
            name,
            sourceImage: base64,
            renderedImage: undefined,
            timestamp: Date.now(),
        }

        const saved = await createProject({item:newItem , visibility:"private"})

        if(!saved){
            console.error("Failed to create project")
            return false
        }

        setProjects((prev)=> [saved, ...(prev || [])])
        navigate(`/visualizer/${newId}`, {
             state: {
                initialImage: saved.sourceImage,
                initialRender: saved.renderedImage || null,
                name,
            }
        })

        return true
        } catch (error) {
            console.log(`Failed to create project` , error);
            return false
        }finally{
            isCreatingRef.current = false
        }

    }

    useEffect(() =>{
        const fetchProjects = async ()=>{
            const items = await getProjects()

            setProjects(items)
        }

        fetchProjects()
    },[])

    const processFile = (file: File) => {
        if (!isSignedIn) return;
        setFile(file);

        const reader = new FileReader();

        reader.onerror=()=>{
            setFile(null)
            setProgress(0)
        }

        reader.onload = (e) => {
            const base64 = e.target?.result as string;

            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setTimeout(() => {
                            // Call onComplete or handle redirection here
                            handelUploadComplete(base64)
                        }, REDIRECT_DELAY_MS);
                        return 100;
                    }
                    return prev + PROGRESS_STEP;
                });
            }, PROGRESS_INTERVAL_MS);
        };

        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (isSignedIn) setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!isSignedIn) return;

        const droppedFile = e.dataTransfer.files[0];
        const allowedTypes=['image/jpeg','image/png','image/jpg']
        if (droppedFile && allowedTypes.includes(droppedFile.type)) {
            processFile(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };



     useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    return <>
        <div className="upload">
            {!file ? (
                <div
                    className={`mt-5 dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className='drop-input'
                        accept='.jpg,.jpeg,.png,webp'
                        disabled={!isSignedIn}
                        onChange={handleChange}
                    />


                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={23} />
                        </div>
                        <p>{isSignedIn ? "Click to upload or just drag and drop" : "Please login to upload"}</p>
                        <div className="help">Maximum file size 50 MB</div>

                    </div>

                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress == 100 ? (<CheckCircle2 className='check' />)
                                : (<ImageIcon className='image' />)}
                        </div>
                        <h3>{file.name}</h3>
                        <div className="progress">
                            <div className="bar" style={{ width: `${progress}%` }} />
                            <p className="status-text">
                                {progress < 100 ? "Analyzing Floor Plan ..." : "Redirecting ..."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </div>



    </>

}

export default Upload
