
// Cloudflare Worker logic removed. The app is currently using local state management for prototype mode.
export default {
  async fetch(request: Request): Promise<Response> {
    return new Response("Local Mode Active", { status: 200 });
  },
};
