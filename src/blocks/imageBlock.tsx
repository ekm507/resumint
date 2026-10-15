import { useRef, useEffect } from "react";
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

  const updateRef = useRef(update);
  const blockRef = useRef(block);
  useEffect(() => {
    updateRef.current = update;
    blockRef.current = block;
  });

  const handleFile = (file: File) => {
    if (file.size > 5_000_000) {
      alert("Image too large. Maximum size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const currentBlock = blockRef.current || block;
      const currentUpdate = updateRef.current || update;
      currentUpdate({
        ...currentBlock,
        props: {
          ...(currentBlock?.props || {}),
          src: reader.result as string,
        },
      });
    };
    reader.onerror = () => alert("Failed to read file.");
    reader.readAsDataURL(file);
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    (window as any).__imageFileDialogOpen = true;
    fileInputRef.current?.click();
  };

  // Clear the dialog flag once the native file picker is closed.
  useEffect(() => {
    const clear = () => {
      (window as any).__imageFileDialogOpen = false;
    };
    window.addEventListener("focus", clear);
    return () => window.removeEventListener("focus", clear);
  }, []);

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
            <span>{alt || "No image"}</span>
          </div>
        )}

        <button
          type="button"
          className="image-upload-overlay"
          onClick={openFilePicker}
        >
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />

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

  if (!canPreview) {
    return (
      <div className="resume-item-image flex image-justify-center">
        <div className="image-placeholder">{alt || "Image"}</div>
      </div>
    );
  }

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
