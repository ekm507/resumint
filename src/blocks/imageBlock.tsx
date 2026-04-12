import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";
import { useMemo } from "react";

export function ImageEditor({ block, update }: any) {
  const {
    src = "",
    alt = "",
    width = 100,
    align = "center",
    shape = "rounded",
  } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const compressImage = (file: File, maxWidth = 1200, quality = 0.8) => {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onerror = () => reject(new Error("Failed to read file"));
      img.onerror = () => reject(new Error("Failed to load image"));

      reader.onload = () => {
        img.src = reader.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    if (file.size > 5_000_000) {
      alert("Image too large. Maximum size is 5MB.");
      return;
    }

    if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
      const reader = new FileReader();
      reader.onload = () => setProp("src", reader.result);
      reader.readAsDataURL(file);
      return;
    }

    try {
      const base64 = await compressImage(file);
      setProp("src", base64);
    } catch (e) {
      console.error(e);
      alert("Failed to process image.");
    }
  };

  // Decide if we can preview
  const canPreview = useMemo(() => {
    if (!src) return false;
    // data URL
    if (src.startsWith("data:image/")) return true;
    // common remote URL patterns
    try {
      const u = new URL(src);
      return /^https?:$/.test(u.protocol);
    } catch {
      return false;
    }
  }, [src]);

  // A short label for the current src to avoid showing entire base64
  const srcLabel = useMemo(() => {
    if (!src) return "No image selected";
    if (src.startsWith("data:image/")) {
      const type = src.slice(5, src.indexOf(";")) || "image";
      return `Embedded ${type}`;
    }
    try {
      const u = new URL(src);
      // show origin + last path part
      const parts = u.pathname.split("/").filter(Boolean);
      const tail = parts.length ? parts[parts.length - 1] : "";
      return `${u.host}${tail ? " / " + decodeURIComponent(tail) : ""}`;
    } catch {
      return "Custom URL";
    }
  }, [src]);

  return (
    <div className="image-block-editor">
      <div
        className="image-editor-row"
        style={{ display: "flex", gap: 12, alignItems: "center" }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>Image</strong>
          </div>

          <div style={{ marginTop: 8 }}>
            <input
              className="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        </div>

        <div className="image-editor-preview" title={srcLabel}>
          {canPreview ? (
            <img src={src} alt={alt || "image preview"} />
          ) : (
            <span>No preview</span>
          )}
        </div>
      </div>

      <AdvancedOptions block={block} update={update}>
        <input
          placeholder="alt text"
          value={alt}
          onChange={(e) => setProp("alt", e.target.value)}
        />
        <div>
          <div className="advanced-group">
            <label>Width: {width}%</label>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={width}
              onChange={(e) => setProp("width", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="options-grid">
          <div className="advanced-group">
            <label>shape</label>
            <ToggleButton
              value={shape}
              onChange={(v) => setProp("shape", v)}
              options={[
                { value: "solid", label: "solid" },
                { value: "rounded", label: "rounded" },
                { value: "circle", label: "circle" },
              ]}
            />
          </div>
        </div>
      </AdvancedOptions>
    </div>
  );
}

export function ImageRender({ block }: any) {
  const { src, alt = "", width = 40, shape = "rounded" } = block.props || {};

  return (
    <div className={`resume-item-image flex image-justify-center`}>
      <img
        src={src}
        alt={alt}
        style={{ width: `${width}%` }}
        className={`resume-image image-shape-${shape}`}
      />
    </div>
  );
}

registerBlock({
  type: "image",
  label: "Image",

  create(): Block {
    return {
      id: "",
      blockType: "image",
      props: {
        src: "https://",
        alt: "",
        width: 100,
        shape: "rounded",
      },
    };
  },

  Editor: ImageEditor,
  Render: ImageRender,
});
