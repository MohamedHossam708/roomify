import { useLocation, useLoaderData } from 'react-router'

export const visualizerLoader = async ({ params }: any) => {
    // Fetch/load the project by id (mock implementation)
    return {
        id: params.id,
        initialImage: null, // fetched hydrated data
        name: null
    }
}

export { visualizerLoader as loader }

const Visualizer = () => {
    const location = useLocation()
    const loaderData = useLoaderData() as any

    const { initialImage: stateImage, name: stateName } = location.state || {}
    const initialImage = loaderData?.initialImage || stateImage
    const name = loaderData?.name || stateName

    return (
        <section>
            <h1>{name || 'Untitled Project'}</h1>
            <div className="visualizer">
                {initialImage && (
                    <div className="image-container">
                        <h2>Source Image</h2>
                        <img src={initialImage} alt="Source Image" />
                    </div>
                )}

            </div>
        </section>
    )
}

export default Visualizer
