import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("test", "routes/test.tsx"),
    route("ndoc/:naddr", "routes/testid.tsx")
] satisfies RouteConfig;
