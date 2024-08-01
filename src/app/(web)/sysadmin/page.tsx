import withAdminGuard from "@/lib/routeMiddleware/withAdminGuard";

function AdminPage() {
  return <div>Admin Page</div>;
}

export default withAdminGuard(AdminPage);
