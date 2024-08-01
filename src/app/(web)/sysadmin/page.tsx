import { adminRouteBuilder } from "@/lib/routeBuilders/adminRouteBuilder";

const AdminPage = adminRouteBuilder.route(async () => {
  return <div>Admin Page</div>;
});

export default AdminPage;
