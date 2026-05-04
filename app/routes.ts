import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/Home.tsx"),
    route('visualizer/:id', 'routes/visualizer.$id.tsx')
] satisfies RouteConfig;
