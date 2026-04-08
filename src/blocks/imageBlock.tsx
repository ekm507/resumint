import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";

export function ImageEditor({ block, update }: any) {
  const {
    src = "",
    alt = "",
    width = "100%",
    align = "center",
  } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  const compressImage = (file: File, maxWidth = 1200, quality = 0.8) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const scale = Math.min(1, maxWidth / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    // size limit
    if (file.size > 5_000_000) {
      alert("Image too large. Maximum size is 5MB.");
      return;
    }

    if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
      const reader = new FileReader();

      reader.onload = () => {
        setProp("src", reader.result);
      };

      reader.readAsDataURL(file);
      return;
    }

    const base64 = await compressImage(file);
    setProp("src", base64);
  };

  return (
    <div className="image-block-editor">
      <input
        placeholder="image url"
        value={src}
        onChange={(e) => setProp("src", e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <input
        placeholder="alt text"
        value={alt}
        onChange={(e) => setProp("alt", e.target.value)}
      />

      <div>
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

      <select value={align} onChange={(e) => setProp("align", e.target.value)}>
        <option value="start">start</option>
        <option value="center">center</option>
        <option value="end">end</option>
      </select>
    </div>
  );
}

export function ImageRender({ block }: any) {
  const { src, alt = "", width = 40, align = "center" } = block.props || {};

  const image = (
    <img
      src={src}
      alt={alt}
      style={{ width: `${width}%` }}
      className="resume-image"
    />
  );

  return <div className={`resume-item-image justify-${align}`}>{image}</div>;
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
        align: "center",
      },
    };
  },

  Editor: ImageEditor,
  Render: ImageRender,
});
