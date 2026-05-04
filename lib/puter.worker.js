const Project_Prefix=`roomify_project_`

const jsonError=(status , message , extra ={})=>{
   return new Response(JSON.stringify({error:message , ...extra}) , 
    {status ,
     headers:{"Content-Type":"application/json",
            "Access-Control-Allow-Origin":"*"}})
}

const getUserId = async (userObj) => {
    try {
        if (userObj?.uuid) return userObj.uuid;
        if (userObj?.id) return userObj.id;
        const u = await userObj.puter.auth.getUser();
        return u?.uuid || null;
    } catch (error) {
        throw new Error("getUserId failed: " + error.message);
    }
}

router.post(`/api/projects/save`, async ({request , user})=>{
    try {

    const userPuter = user.puter

    if(!userPuter){
        return jsonError(401,'Authentication failed')
    }

    const body = await request.json()
    const project = body?.project

if (!project?.id || !project?.sourceImage){
    return jsonError(400,'Project not Found')
}

const payLoad = {
    ...project,
    updatedAt:new Date().toISOString()
}

let userId;
try {
    userId = await getUserId(user);
} catch (error) {
    return jsonError(401, 'Authentication failed', { details: error.message });
}
if (!userId) { return jsonError(401, 'Authentication failed', { details: 'No user ID found' }) }

const key =`${Project_Prefix}${project.id}`

await userPuter.kv.set(key , payLoad)

return {saved:true , id :project.id , project : payLoad}

    } catch (error) {
        return jsonError(500 , `Failed to save project` ,{message:error.message || "Unknown error"})
    }
})

router.get(`/api/projects/list`, async ({request , user})=>{
    try {
        const userPuter = user.puter

        if(!userPuter){
            return jsonError(401,'Authentication failed')
        }

        let userId;
        try {
            userId = await getUserId(user);
        } catch (error) {
            return jsonError(401, 'Authentication failed', { details: error.message });
        }
        if (!userId) { return jsonError(401, 'Authentication failed', { details: 'No user ID found' }) }

        const projects = (await userPuter.kv.list(Project_Prefix , true))
        .map((project)=>({...project , isPublic:true}))

        return {projects}
    } catch (error) {
        return jsonError(500 , `Failed to list projects` ,{message:error.message || "Unknown error"})
    }
})

router.get(`/api/projects/get`, async ({request , user})=>{
    try {
        const userPuter = user.puter

        if(!userPuter){
            return jsonError(401,'Authentication failed')
        }

        let userId;
        try {
            userId = await getUserId(user);
        } catch (error) {
            return jsonError(401, 'Authentication failed', { details: error.message });
        }
        if (!userId) { return jsonError(401, 'Authentication failed', { details: 'No user ID found' }) }

        const url = new URL(request.url)
        const id = url.searchParams.get('id')

        if(!id){
            return jsonError(400,'Project ID is required')
        }

        const key = `${Project_Prefix}${id}`
        const project = await userPuter.kv.get(key)

        if (!project){return jsonError(404 , 'Project not Found')}

        return {project}
    } catch (error) {
        return jsonError(500 , `Failed to get project` ,{message:error.message || "Unknown error"})
    }
})