"use client";

import { useParams } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminGate, AdminNav } from "../../AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";

export function EditProjectView() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useApp();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <Section>
        <AdminGate>
          <AdminNav />
          <p>Listing not found.</p>
          <Button href="/admin/projects" className="mt-4">Back</Button>
        </AdminGate>
      </Section>
    );
  }

  return <ProjectForm existing={project} />;
}
