"use client";

import { useParams } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { AdminGate, AdminNav } from "../../AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";

export function EditBlogView() {
  const { id } = useParams<{ id: string }>();
  const { posts } = useApp();
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return (
      <Section>
        <AdminGate>
          <AdminNav />
          <p>Post not found.</p>
          <Button href="/admin/blog" className="mt-4">
            Back
          </Button>
        </AdminGate>
      </Section>
    );
  }

  return <BlogForm existing={post} />;
}
