import JSZip from "jszip";

import { downloadBlob } from "./functions";
import type { FormStructure, LayoutItem } from "./types";

interface ExportedImage {
  path: string;
  bytes: Uint8Array;
}

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/svg+xml") return "svg";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "png";
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const commaIndex = dataUrl.indexOf(",");
  const base64 = dataUrl.slice(commaIndex + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function prepareBlock(block: any, images: ExportedImage[]): any {
  if (!block) return block;

  const next = { ...block };

  if (Array.isArray(block.children)) {
    next.children = block.children.map((child: any) =>
      prepareBlock(child, images),
    );
  }

  if (block.props && typeof block.props === "object") {
    const props = { ...block.props };

    if (
      block.blockType === "image" &&
      typeof props.src === "string" &&
      props.src.startsWith("data:")
    ) {
      const mimeMatch = props.src.match(/^data:([^;,]+)/);
      const mime = mimeMatch?.[1] || "image/png";
      const ext = extFromMime(mime);
      const safeId = String(block.id || crypto.randomUUID()).replace(
        /[^a-zA-Z0-9_-]/g,
        "",
      );
      const path = `images/${safeId || crypto.randomUUID()}.${ext}`;
      images.push({ path, bytes: dataUrlToBytes(props.src) });
      props.src = path;
    }

    if (Array.isArray(props.columns)) {
      props.columns = props.columns.map((column: any) => ({
        ...column,
        children: Array.isArray(column?.children)
          ? column.children.map((child: any) => prepareBlock(child, images))
          : column?.children,
      }));
    }

    next.props = props;
  }

  return next;
}

function prepareExport(forms: FormStructure[]) {
  const images: ExportedImage[] = [];
  const exportedForms = forms.map((form) => ({
    ...form,
    blocks: Array.isArray(form.blocks)
      ? form.blocks.map((block) => prepareBlock(block, images))
      : form.blocks,
  }));
  return { forms: exportedForms, images };
}

async function hydrateBlock(block: any, zip: JSZip): Promise<any> {
  if (!block) return block;

  const next = { ...block };

  if (Array.isArray(block.children)) {
    next.children = await Promise.all(
      block.children.map((child: any) => hydrateBlock(child, zip)),
    );
  }

  if (block.props && typeof block.props === "object") {
    const props = { ...block.props };

    if (block.blockType === "image" && typeof props.src === "string") {
      const zipEntry =
        zip.file(props.src) ||
        Object.keys(zip.files)
          .filter((name) => !zip.files[name].dir)
          .map((name) => ({ name, entry: zip.file(name) }))
          .find(
            ({ name }) =>
              name === props.src ||
              name.endsWith(`/${props.src}`) ||
              name.endsWith(props.src.replace(/^images\//, "")),
          )?.entry;

      if (zipEntry) {
        const bytes = await zipEntry.async("uint8array");
        const ext = String(props.src).split(".").pop()?.toLowerCase() || "png";
        const mime =
          ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : ext === "svg"
              ? "image/svg+xml"
              : ext === "gif"
                ? "image/gif"
                : ext === "webp"
                  ? "image/webp"
                  : "image/png";
        const blob = new Blob([bytes as unknown as BlobPart], { type: mime });
        props.src = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
      } else {
        console.warn("Image not found in imported archive:", props.src);
      }
    }

    if (Array.isArray(props.columns)) {
      props.columns = await Promise.all(
        props.columns.map(async (column: any) => ({
          ...column,
          children: Array.isArray(column?.children)
            ? await Promise.all(
                column.children.map((child: any) => hydrateBlock(child, zip)),
              )
            : column?.children,
        })),
      );
    }

    next.props = props;
  }

  return next;
}

export async function exportResumeData(
  forms: FormStructure[],
  layout: LayoutItem[],
  filename = "thecv_data.zip",
) {
  const { forms: exportedForms, images } = prepareExport(forms);

  const zip = new JSZip();
  zip.file(
    "resume.json",
    JSON.stringify({ forms: exportedForms, layout }, null, 2),
  );

  images.forEach((image) => {
    zip.file(image.path, image.bytes);
  });

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
  });

  downloadBlob(blob, filename);
}

export async function importResumeData(file: File) {
  try {
    const zip = await JSZip.loadAsync(file);
    const jsonFile = zip.file("resume.json");


    if (jsonFile) {
      const text = await jsonFile.async("string");
      const data = JSON.parse(text);

      if (Array.isArray(data?.forms)) {
        data.forms = await Promise.all(
          data.forms.map(async (form: any) => ({
            ...form,
            blocks: Array.isArray(form?.blocks)
              ? await Promise.all(
                  form.blocks.map((block: any) => hydrateBlock(block, zip)),
                )
              : form?.blocks,
          })),
        );
      }

      return data;
    }
  } catch {
    // Fall through to plain JSON handling.
  }

  const text = await file.text();
  return JSON.parse(text);
}
