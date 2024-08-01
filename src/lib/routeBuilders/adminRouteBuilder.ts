import { routeBuilder } from "@/lib/util/fluentRouteBuilder";
import adminGuard from "@/lib/routeMiddleware/adminGuard";

export const adminRouteBuilder = routeBuilder.guard(adminGuard, {
  redirect: "/",
});
