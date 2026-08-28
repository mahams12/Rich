"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminGate, AdminNav } from "@/app/admin/AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Field, Section, inputClass } from "@/components/ui/Button";
import { uid } from "@/lib/format";
import type { CategoryId, Project } from "@/types";

function emptyGallery(existing?: Project): [string, string, string] {
  return [existing?.gallery?.[0] ?? "", existing?.gallery?.[1] ?? "", existing?.gallery?.[2] ?? ""];
}

function GalleryUpload({
  label,
  value,
  uploading,
  disabled,
  onUpload,
  onRemove,
}: {
  label: string;
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
        {uploading ? "Uploading…" : "Choose a photo from your device (max 5 MB)."}
      </p>
      {value ? (
        <div className="mt-3 space-y-2">
          <img src={value} alt="" className="h-32 w-full rounded-2xl bg-[#1a1410] object-contain" />
          <button type="button" className="text-xs text-rose-700" onClick={onRemove}>
            Remove photo
          </button>
        </div>
      ) : null}
    </Field>
  );
}

export function ProjectForm({ existing }: { existing?: Project }) {
  const { upsertProject, deleteProject, toast } = useApp();
  const router = useRouter();
  const [cover, setCover] = useState(existing?.cover ?? "");
  const [gallery, setGallery] = useState<[string, string, string]>(emptyGallery(existing));
  const [uploadingSlot, setUploadingSlot] = useState<"cover" | 0 | 1 | 2 | null>(null);
  const [saving, setSaving] = useState(false);
  const projectId = existing?.id ?? uid("p");
  const uploading = uploadingSlot !== null;

  async function onFile(slot: "cover" | 0 | 1 | 2, file?: File) {
    if (!file) return;
    setUploadingSlot(slot);
    try {
      const [{ uploadProjectCover }, { firebaseErrorMessage }] = await Promise.all([
        import("@/lib/firebase/storage"),
        import("@/lib/firebase/errors"),
      ]);
      const url = await uploadProjectCover(file, projectId);
      if (slot === "cover") setCover(url);
      else setGallery((current) => current.map((item, index) => (index === slot ? url : item)) as [string, string, string]);
      toast("Photo uploaded");
    } catch (error) {
      const { firebaseErrorMessage } = await import("@/lib/firebase/errors");
      toast("Upload failed", firebaseErrorMessage(error));
    } finally {
      setUploadingSlot(null);
    }
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
    const slug = existing?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cleanedGallery = gallery.map((item) => item.trim()).filter(Boolean);
    const project: Project = {
      ...(existing ?? {
        id: projectId,
        rating: 5,
        reviewCount: 0,
        views: 0,
        favourites: 0,
        customizable: true,
        readyMade: true,
        trending: false,
        availability: "ready",
        included: ["Source / files", "Handover"],
        notIncluded: ["Third-party fees"],
        support: "Launch support",
        visual: { kind: "web", mood: "neon", height: "medium" as const },
      }),
      id: projectId,
      slug,
      title,
      tagline: String(data.get("tagline")),
      description: String(data.get("description")),
      category: String(data.get("category")) as CategoryId,
      subcategory: String(data.get("subcategory")),
      tags: String(data.get("tags")).split(",").map((item) => item.trim()).filter(Boolean),
      technologies: String(data.get("technologies")).split(",").map((item) => item.trim()).filter(Boolean),
      features: String(data.get("features")).split("\n").map((item) => item.trim()).filter(Boolean),
      customizationNotes: String(data.get("customizationNotes")),
      maxCustomizationWords: Number(data.get("maxCustomizationWords") || 100),
      price: Number(data.get("price")),
      currency: "USD",
      deliveryDays: Number(data.get("deliveryDays")),
      featured: Boolean(data.get("featured")),
      status: "published",
      cover: cover || "",
      gallery: cleanedGallery.length ? cleanedGallery : undefined,
    };
    upsertProject(project);
    setSaving(false);
    router.push("/admin/projects");
  }

  return (
    <Section className="max-w-3xl">
      <AdminGate>
        <AdminNav />
        <h1 className="display text-3xl">{existing ? "Edit listing" : "Create listing"}</h1>
        <form onSubmit={submit} className="glass mt-6 grid gap-4 rounded-[2rem] p-6">
          <Field label="Title"><input name="title" required defaultValue={existing?.title} className={inputClass} /></Field>
          <Field label="Tagline"><input name="tagline" required defaultValue={existing?.tagline} className={inputClass} /></Field>
          <Field label="Description"><textarea name="description" required defaultValue={existing?.description} className={`${inputClass} min-h-28`} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select name="category" defaultValue={existing?.category} className={inputClass}>
                <option value="websites">Websites</option>
                <option value="mobile">Mobile</option>
                <option value="ecommerce">Ecommerce</option>
                <option value="ai">AI</option>
                <option value="uiux">UI/UX</option>
                <option value="creative">Creative</option>
                <option value="features">Features</option>
                <option value="academic">Academic</option>
              </select>
            </Field>
            <Field label="Subcategory"><input name="subcategory" required defaultValue={existing?.subcategory} className={inputClass} /></Field>
            <Field label="Price USD"><input name="price" type="number" min={50} required defaultValue={existing?.price} className={inputClass} /></Field>
            <Field label="Delivery days"><input name="deliveryDays" type="number" min={1} required defaultValue={existing?.deliveryDays} className={inputClass} /></Field>
            <Field label="Word limit"><input name="maxCustomizationWords" type="number" defaultValue={existing?.maxCustomizationWords ?? 100} className={inputClass} /></Field>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/40 p-4">
            <p className="text-sm font-semibold text-ink">Project photos</p>
            <p className="mt-1 text-xs text-muted">
              Cover appears on portfolio cards. Preview 1–3 are the three images on the live project page.
            </p>
            <div className="mt-4 grid gap-4">
              <GalleryUpload
                label="Cover photo (portfolio card)"
                value={cover}
                uploading={uploadingSlot === "cover"}
                disabled={uploading}
                onUpload={(file) => onFile("cover", file)}
                onRemove={() => setCover("")}
              />
              <GalleryUpload
                label="Preview image 1"
                value={gallery[0]}
                uploading={uploadingSlot === 0}
                disabled={uploading}
                onUpload={(file) => onFile(0, file)}
                onRemove={() => setGallery((current) => ["", current[1], current[2]])}
              />
              <GalleryUpload
                label="Preview image 2"
                value={gallery[1]}
                uploading={uploadingSlot === 1}
                disabled={uploading}
                onUpload={(file) => onFile(1, file)}
                onRemove={() => setGallery((current) => [current[0], "", current[2]])}
              />
              <GalleryUpload
                label="Preview image 3"
                value={gallery[2]}
                uploading={uploadingSlot === 2}
                disabled={uploading}
                onUpload={(file) => onFile(2, file)}
                onRemove={() => setGallery((current) => [current[0], current[1], ""])}
              />
            </div>
          </div>
          <Field label="Tags (comma)"><input name="tags" defaultValue={existing?.tags.join(", ")} className={inputClass} /></Field>
          <Field label="Technologies (comma)"><input name="technologies" defaultValue={existing?.technologies.join(", ")} className={inputClass} /></Field>
          <Field label="Features (one per line)"><textarea name="features" defaultValue={existing?.features.join("\n")} className={`${inputClass} min-h-28`} /></Field>
          <Field label="Customization notes"><textarea name="customizationNotes" defaultValue={existing?.customizationNotes} className={`${inputClass} min-h-24`} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={existing?.featured} /> Featured</label>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={uploading || saving}>
              {uploading ? "Uploading…" : existing ? "Save changes" : "Publish listing"}
            </Button>
            {existing ? (
              <Button
                type="button"
                variant="ghost"
                className="text-rose-700"
                onClick={() => {
                  if (window.confirm(`Delete “${existing.title}”?`)) {
                    deleteProject(existing.id);
                    router.push("/admin/projects");
                  }
                }}
              >
                Delete listing
              </Button>
            ) : null}
            {existing ? (
              <Button type="button" variant="ghost" href={`/projects/${existing.slug}`}>
                Preview live page
              </Button>
            ) : null}
          </div>
        </form>
      </AdminGate>
    </Section>
  );
}
