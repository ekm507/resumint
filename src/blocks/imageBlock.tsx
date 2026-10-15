import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function ImageEditor({ block, update }: any) {
  const {
    src = "",
    alt = "",
    width = 100,
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

  const canPreview = src && (
    src.startsWith("data:image/") ||
    (() => {
      try {
        const u = new URL(src);
        return /^https?:$/.test(u.protocol);
      } catch {
        return false;
      }
    })()
  );

  return (
    <div className="image-block-editor">
      <div className="resume-item-image flex image-justify-center image-editor-host">
        {canPreview ? (
          <img
            src={src}
            alt={alt || "image"}
            style={{ width: `${width}%` }}
            className={`resume-image image-shape-${shape}`}
          />
        ) : (
          <div className="image-editor-preview">
            <span>No image</span>
          </div>
        )}

        <label className="image-upload-overlay">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          Upload
        </label>

        {src && (
          <button
            className="image-remove-overlay"
            onClick={() => setProp("src", "")}
            title="remove image"
          >
            ×
          </button>
        )}
      </div>

      <AdvancedOptions block={block} update={update}>
        <input
          className="text-input"
          placeholder="alt text"
          value={alt}
          onChange={(e) => setProp("alt", e.target.value)}
        />
        <div className="option-group">
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
        <div className="options-grid">
          <div className="option-group">
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
