"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminGate, AdminNav } from "@/app/admin/AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Field, Section, inputClass } from "@/components/ui/Button";
import { uid } from "@/lib/format";
import type { BlogPost } from "@/types";

type GallerySlots = [string, string, string, string];

function emptyGallery(existing?: BlogPost): GallerySlots {
  const g = existing?.gallery ?? [];
  return [g[0] ?? existing?.cover ?? "", g[1] ?? "", g[2] ?? "", g[3] ?? ""];
}

function GalleryUpload({
  label,
  hint,
  value,
  uploading,
  disabled,
  onUpload,
  onRemove,
}: {
  label: string;
  hint?: string;
  value: string;
  uploading: boolean;
  disabled: boolean;
  onUpload: (file?: File) => void;
  onRemove: () => void;
}) {
  return (
    <Field label={label}>
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm"
        disabled={disabled}
        onChange={(e) => onUpload(e.target.files?.[0])}
      />
      <p className="mt-2 text-xs text-muted">
        {uploading ? "Uploading…" : hint ?? "Choose a photo from your device (max 5 MB)."}
      </p>
      {value ? (
        <div className="mt-3 space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-32 w-full rounded-2xl bg-[#1a1410] object-contain" />
          <button type="button" className="text-xs text-rose-700" onClick={onRemove}>
            Remove photo
          </button>
        </div>
      ) : null}
    </Field>
  );
}

export function BlogForm({ existing }: { existing?: BlogPost }) {
  const { upsertPost, deletePost, toast } = useApp();
  const router = useRouter();
  const [gallery, setGallery] = useState<GallerySlots>(emptyGallery(existing));
  const [uploadingSlot, setUploadingSlot] = useState<0 | 1 | 2 | 3 | null>(null);
  const [saving, setSaving] = useState(false);
  const postId = existing?.id ?? uid("b");
  const uploading = uploadingSlot !== null;

  async function onFile(slot: 0 | 1 | 2 | 3, file?: File) {
    if (!file) return;
    setUploadingSlot(slot);
    try {
      const [{ uploadBlogCover }, { firebaseErrorMessage }] = await Promise.all([
        import("@/lib/firebase/storage"),
        import("@/lib/firebase/errors"),
      ]);
      const url = await uploadBlogCover(file, postId);
      setGallery((current) => current.map((item, index) => (index === slot ? url : item)) as GallerySlots);
      toast(url.startsWith("data:") ? "Photo added" : "Photo uploaded");
    } catch (error) {
      const { firebaseErrorMessage } = await import("@/lib/firebase/errors");
      toast("Upload failed", firebaseErrorMessage(error));
    } finally {
      setUploadingSlot(null);
    }
  }

  function clearSlot(slot: 0 | 1 | 2 | 3) {
    setGallery((current) => current.map((item, index) => (index === slot ? "" : item)) as GallerySlots);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading) {
      toast("Wait for upload", "A photo is still uploading.");
      return;
    }
    setSaving(true);
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title"));
    const slug =
      existing?.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const cleanedGallery = gallery.map((item) => item.trim()).filter(Boolean);
    const now = new Date().toISOString();
    const status = String(data.get("status") || "published") as BlogPost["status"];
    const post: BlogPost = {
      id: postId,
      slug,
      title,
      excerpt: String(data.get("excerpt")),
      content: String(data.get("content")),
      tags: String(data.get("tags"))
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      keywords: String(data.get("keywords"))
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      seoTitle: String(data.get("seoTitle") || "").trim() || undefined,
      seoDescription: String(data.get("seoDescription") || "").trim() || undefined,
      featured: Boolean(data.get("featured")),
      trending: Boolean(data.get("trending")),
      status,
      author: String(data.get("author") || "NovexaHub Studio"),
      createdAt: existing?.createdAt ?? now,
      publishedAt: existing?.publishedAt ?? now,
      updatedAt: now,
      cover: cleanedGallery[0] || "",
      gallery: cleanedGallery.length ? cleanedGallery : undefined,
    };
    upsertPost(post);
    setSaving(false);
    router.push("/admin/blog");
  }

  const labels = [
    "Cover image (main)",
    "Image 2 — optional",
    "Image 3 — optional",
    "Image 4 — optional",
  ] as const;

  return (
    <Section className="max-w-3xl">
      <AdminGate>
        <AdminNav />
        <h1 className="display text-3xl">{existing ? "Edit blog post" : "New blog post"}</h1>
        <form onSubmit={submit} className="glass mt-6 grid gap-4 rounded-[2rem] p-6">
          <Field label="Title">
            <input name="title" required defaultValue={existing?.title} className={inputClass} />
          </Field>
          <Field label="Excerpt (SEO summary)">
            <textarea name="excerpt" required defaultValue={existing?.excerpt} className={`${inputClass} min-h-20`} />
          </Field>
          <Field label="Body (paragraphs separated by a blank line)">
            <textarea name="content" required defaultValue={existing?.content} className={`${inputClass} min-h-56`} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Author">
              <input name="author" defaultValue={existing?.author ?? "NovexaHub Studio"} className={inputClass} />
            </Field>
            <Field label="Status">
              <select name="status" defaultValue={existing?.status ?? "published"} className={inputClass}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/40 p-4">
            <p className="text-sm font-semibold text-ink">Post photos</p>
            <p className="mt-1 text-xs text-muted">
              Upload 1 to 4 images. Image 1 is the cover used on the blog list and social previews.
            </p>
            <div className="mt-4 grid gap-4">
              {labels.map((label, slot) => (
                <GalleryUpload
                  key={label}
                  label={label}
                  hint={slot === 0 ? "Recommended for SEO / Open Graph." : "Optional."}
                  value={gallery[slot]}
                  uploading={uploadingSlot === slot}
                  disabled={uploading}
                  onUpload={(file) => onFile(slot as 0 | 1 | 2 | 3, file)}
                  onRemove={() => clearSlot(slot as 0 | 1 | 2 | 3)}
                />
              ))}
            </div>
          </div>
          <Field label="Tags (comma)">
            <input name="tags" defaultValue={existing?.tags.join(", ")} className={inputClass} />
          </Field>
          <Field label="SEO keywords (comma)">
            <input
              name="keywords"
              defaultValue={existing?.keywords.join(", ")}
              placeholder="software project, NovexaHub, custom website"
              className={inputClass}
            />
          </Field>
          <Field label="SEO title (optional)">
            <input name="seoTitle" defaultValue={existing?.seoTitle} className={inputClass} />
          </Field>
          <Field label="SEO description (optional)">
            <textarea name="seoDescription" defaultValue={existing?.seoDescription} className={`${inputClass} min-h-20`} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={existing?.featured} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="trending" defaultChecked={existing?.trending} /> Trending
          </label>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={uploading || saving}>
              {uploading ? "Uploading…" : existing ? "Save changes" : "Publish post"}
            </Button>
            {existing ? (
              <Button
                type="button"
                variant="ghost"
                className="text-rose-700"
                onClick={() => {
                  if (window.confirm(`Delete “${existing.title}”?`)) {
                    deletePost(existing.id);
                    router.push("/admin/blog");
                  }
                }}
              >
                Delete post
              </Button>
            ) : null}
            {existing ? (
              <Button type="button" variant="ghost" href={`/blog/${existing.slug}`}>
                Preview live page
              </Button>
            ) : null}
          </div>
        </form>
      </AdminGate>
    </Section>
  );
}
