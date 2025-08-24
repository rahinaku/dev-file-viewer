import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/image", "routes/api.image.tsx"),
  route("api/file", "routes/api.file.tsx")
] satisfies RouteConfig;
