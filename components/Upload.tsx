import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'
import type { AuthContext } from 'type'
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from '../lib/constants'

const Upload = () => {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [progress, setProgress] = useState(0)
    const { isSignedIn } = useOutletContext<AuthContext>()
    
    const navigate = useNavigate()

  const handelUploadComplete= async (base64:string)=>{
    const newId = Date.now().toString()

    navigate(`/visualizer/${newId}`)

    return true

  }

    const processFile = (file: File) => {
        if (!isSignedIn) return;
        setFile(file);

        const reader = new FileReader();

        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
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
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            processFile(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

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
                        accept='.jpg,.jpeg,.png'
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
