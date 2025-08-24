import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/image", "routes/api.image.tsx")
] satisfies RouteConfig;
