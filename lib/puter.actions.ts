import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, UploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utlis";
import { PUTER_WORKER_URL } from "./constants";


export const signIn = async () => await puter.auth.signIn()

export const signOut = async () => puter.auth.signOut()

export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser()
    } catch (error) {
        return null
    }
}

export const createProject = async ({ item, visibility }: CreateProjectParams):
    Promise<DesignItem | null | undefined> => {


    if (!PUTER_WORKER_URL) {
        console.warn('missing Vite Puter Worker URL , Skip history fetch');
        return null
    }


    const projectId = item.id

    const hosting = await getOrCreateHostingConfig()

    const hostedSource = projectId ?
        await UploadImageToHosting({
            hosting,
            url: item.sourceImage,
            projectId,
            label: 'source'
        }) : null

    const hostedRendered = projectId && item.renderedImage ?
        await UploadImageToHosting({
            hosting,
            url: item.renderedImage,
            projectId,
            label: 'rendered'
        }) : null

    const resolvedSource = hostedSource?.url || item.sourceImage

    if (!resolvedSource) {
        console.warn(`Faild to host Source Image , Skipping save`);
        return null

    }

    const resolveRender = hostedRendered?.url
        ? hostedRendered?.url
        : item.renderedImage && isHostedUrl(item.renderedImage)
            ? item.renderedImage
            : undefined

    const { sourcePath: _sourcePath,
        renderedPath: _renderedPath,
        publicPath: _publicPath,
        ...rest } = item

    const paylaod = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: resolveRender,

    }

    try {

      const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        project: paylaod,
        visibility
    })
});

        if (!response.ok) {
            console.error(`Faild to save project`, await response.text());
            return null
        }

        const data = (await response.json()) as { project: DesignItem | null }

        return data?.project ?? null

    } catch (error) {
        console.log(`Faild to save project`, error);
        return null
    }
}


export const getProjects = async () => {
    if (!PUTER_WORKER_URL) {
        console.warn('missing Vite Puter Worker URL , Skip history fetch');
        return []
    }
    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, {
            method: 'GET'
        })

        if (!response.ok) {
            console.error(`Faild to Fetch History `, await response.text())
            return []
        }

        const data = await response.json() as { projects: DesignItem[] | null }
        return Array.isArray(data.projects) ? data.projects : []

    } catch (error) {
        console.log(`Failed to get projects`, error);
        return []
    }
}

export const getProjectById = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) {
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
        return null;
    }

    console.log("Fetching project with ID:", id);

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        console.log("Fetch project response:", response);

        if (!response.ok) {
            console.error("Failed to fetch project:", await response.text());
            return null;
        }

        const data = (await response.json()) as {
            project?: DesignItem | null;
        };

        console.log("Fetched project data:", data);

        return data?.project ?? null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
};