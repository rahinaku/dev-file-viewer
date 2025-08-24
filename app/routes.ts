import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/directory-pagination", "routes/api.directory-pagination.tsx"),
  route("api/image", "routes/api.image.tsx"),
  route("api/file", "routes/api.file.tsx"),
  route("api/extract-zip", "routes/api.extract-zip.tsx")
] satisfies RouteConfig;
