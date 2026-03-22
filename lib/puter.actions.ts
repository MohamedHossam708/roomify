import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, UploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utlis";


export const signIn= async()=> await puter.auth.signIn()

export const signOut= async ()=>  puter.auth.signOut()

export const getCurrentUser= async ()=>{
    try {
        return await puter.auth.getUser()
    } catch (error) {
        return null
    }
}

export const createProject = async({item}:CreateProjectParams):
Promise<DesignItem | null | undefined>=>{

    const projectId = item.id

    const hosting = await getOrCreateHostingConfig()

    const hostedSource = projectId ?
    await UploadImageToHosting({
        hosting,
        url :item.sourceImage,
        projectId,
        label : 'source'
    }):null 

    const hostedRendered = projectId && item.renderedImage ?
    await UploadImageToHosting({
        hosting,
        url :item.renderedImage,
        projectId,
        label : 'rendered'
    }):null 

    const resolvedSource= hostedSource?.url || (isHostedUrl(item.sourceImage)
    ? item.sourceImage : "")
    
    if(!resolvedSource){
        console.warn(`Faild to host Source Image , Skipping save`);
        return null
        
    }

    const resolveRender= hostedRendered?.url
    ? hostedRendered?.url
    : item.renderedImage && isHostedUrl(item.renderedImage)
    ? item.renderedImage
    : undefined

    const{sourcePath:_sourcePath ,
        renderedPath:_renderedPath ,
        publicPath:_publicPath,
        ...rest}=item
    
    const paylaod={
        ...rest,
        sourceImage:resolvedSource,
        renderedImage:resolveRender,
       
    }

    try {

        return paylaod
        
    } catch (error) {
        console.log(`Faild to save project`,error);
        return null
    }
}