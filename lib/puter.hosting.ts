import puter from "@heyputer/puter.js"
import { createHostingSlug, fetchBlobFromUrl, getHostedUrl, getImageExtension, HOSTING_CONFIG_KEY, imageUrlToPngBlob, isHostedUrl } from "./utlis"

type HostingConfig = {
    subdomain:string,
    
}
type HostedAsset={
    url:string
}



export const getOrCreateHostingConfig = async () : Promise<HostingConfig| null> => {
    // Search if theres data exist with this key
    const existing = (await puter.kv.get(HOSTING_CONFIG_KEY))as HostingConfig | null
    // if it was found return it
    if (existing?.subdomain) return{subdomain : existing.subdomain};

    const subdomain = createHostingSlug()

        // if not found create new one
    try {
       const Created = await puter.hosting.create(subdomain,'.')

       return {subdomain : Created.subdomain}

    } catch (error) {
        console.warn('Cant Find subdomain',error);
        return null
    }
}

export const UploadImageToHosting= async({hosting , url , projectId ,label}:StoreHostedImageParams)
:Promise<HostedAsset | null> =>{
    
    if (!hosting || !url) return null;
    if(isHostedUrl(url)) return {url}
    
    try {
        const resolved= label === 'rendered' ?
        await imageUrlToPngBlob(url).then((blob)=>blob?{blob , contentType : `image/png`}:null)
        :
        await fetchBlobFromUrl(url)

        if(!resolved) return null

       const contentType = resolved.contentType || resolved.blob.type || ''
       const ext = getImageExtension(contentType , url)
       const dir = `projects/${projectId}`
        const filePath = `${dir}/${label}.${ext}`

        const uploadFile =new File([resolved.blob] , `${label}.${ext}`,{
            type : contentType
        })

        await puter.fs.mkdir(dir , {createMissingParents : true})
        await puter.fs.write(filePath , uploadFile)

        const hostedUrl = getHostedUrl({subdomain:hosting.subdomain},filePath)
        if(!hostedUrl) return null

        return {url : hostedUrl}

    } catch (error) {
        console.warn(`Faild to store hosted image`,error)
        return null
    }
    
}
