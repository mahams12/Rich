"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminGate, AdminNav } from "../AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";
import { projects as seedProjects, sortProjectsNewestFirst } from "@/data/projects";
import { formatPrice } from "@/lib/format";
import { readShared } from "@/lib/liveStore";

export function AdminProjectsView() {
  const { projects, setProjectStatus, deleteProject, toast, firebaseReady } = useApp();
  const sorted = useMemo(() => sortProjectsNewestFirst(projects), [projects]);
  const [restoring, setRestoring] = useState(false);
  const publishedCount = sorted.filter((project) => project.status === "published" && !project.deleted).length;
  const draftCount = sorted.filter((project) => project.status === "draft" && !project.deleted).length;
  const archivedCount = sorted.filter((project) => project.status === "archived" || project.deleted).length;

  async function restoreLocalProjects() {
    if (restoring) return;
    setRestoring(true);
    try {
      const localProjects = readShared().projects;
      const seedIds = new Set(seedProjects.map((project) => project.id));
      const currentIds = new Set(projects.map((project) => project.id));
      const candidates = localProjects.filter(
        (project) => !seedIds.has(project.id) && !currentIds.has(project.id) && !project.deleted,
      );

      if (!candidates.length) {
        toast(
          "No missing local projects found",
          "Check the status column for drafts/archived items. A backup from another browser or device must be opened there to recover its projects.",
        );
        return;
      }

      if (firebaseReady) {
        const { saveProject } = await import("@/lib/firebase/db");
        await Promise.all(candidates.map((project) => saveProject(project)));
      } else {
        toast("Firebase is not connected", "These projects cannot be restored to the live site until Firebase is connected.");
        return;
      }
      toast("Local projects restored", `${candidates.length} project(s) sent to the live database. Refresh the portfolio after the list updates.`);
    } catch (error) {
      toast("Could not restore projects", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setRestoring(false);
    }
  }

  return (
    <Section>
      <AdminGate>
        <AdminNav />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="display text-3xl">Projects</h1>
          <div className="flex flex-wrap gap-2">
            {firebaseReady ? (
              <Button type="button" variant="ghost" disabled={restoring} onClick={restoreLocalProjects}>
                {restoring ? "Restoring…" : "Restore local projects"}
              </Button>
            ) : null}
            <Button href="/admin/projects/new">New listing</Button>
          </div>
        </div>
        <p className="mb-5 text-sm text-muted">{publishedCount} published · {draftCount} drafts · {archivedCount} archived. Only published projects appear on the public portfolio.</p>
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
              {sorted.map((project) => (
                <tr key={project.id} className="border-t border-black/10">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{project.title}</p>
                    <p className="text-xs text-muted">{project.category}</p>
                  </td>
                  <td className="px-4 py-3">{formatPrice(project.price)}</td>
                  <td className="px-4 py-3">{project.deliveryDays}</td>
                  <td className="px-4 py-3 capitalize">{project.deleted ? "deleted" : project.status}</td>
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
