import type { Route } from "./+types/chrome-devtools";

export async function loader({ request }: Route.LoaderArgs) {
  // Return empty JSON for Chrome DevTools request
  return Response.json({});
}