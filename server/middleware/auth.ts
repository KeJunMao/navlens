import { authOptions } from "../api/auth/[...]";
import { getServerSession, getServerToken } from "#auth";

export default defineEventHandler(async (event) => {
  if (event.node.req.url?.startsWith("/api/admin/")) {
    const session = await getServerSession(event, authOptions);
    if (!session) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
  }
});
