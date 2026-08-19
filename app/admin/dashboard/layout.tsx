import React from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Top-level dashboard layout — login page lives alongside protected routes.
  // The actual auth guard lives in the `(protected)` route group's layout.
  return <>{children}</>;
}
