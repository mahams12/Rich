"use client";

import Link from "next/link";
import { AdminGate, AdminNav } from "../AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export function AdminProjectsView() {
  const { projects, setProjectStatus, deleteProject } = useApp();

  return (
    <Section>
      <AdminGate>
        <AdminNav />
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="display text-3xl">Projects</h1>
          <Button href="/admin/projects/new">New listing</Button>
        </div>
        <div className="overflow-x-auto rounded-[1.5rem] border border-black/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/[0.03] text-xs uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-black/10">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{project.title}</p>
                    <p className="text-xs text-muted">{project.category}</p>
                  </td>
                  <td className="px-4 py-3">{formatPrice(project.price)}</td>
                  <td className="px-4 py-3">{project.deliveryDays}</td>
                  <td className="px-4 py-3 capitalize">{project.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/projects/${project.id}`} className="font-semibold text-[#c45c3a]">Edit</Link>
                      <Link href={`/projects/${project.slug}`} className="text-muted">View</Link>
                      <button type="button" className="text-muted" onClick={() => setProjectStatus(project.id, project.status === "published" ? "draft" : "published")}>
                        {project.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button type="button" className="text-muted" onClick={() => setProjectStatus(project.id, "archived")}>Archive</button>
                      <button
                        type="button"
                        className="text-rose-700"
                        onClick={() => {
                          if (window.confirm(`Delete “${project.title}”?`)) deleteProject(project.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminGate>
    </Section>
  );
}
