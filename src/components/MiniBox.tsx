import BlockRenderer from "./BlockRenderer";
import type { FormStructure, DirTypeNames } from "../utils/types";

interface Prop {
  form: FormStructure;
  dir?: DirTypeNames;
}
export default function MiniBox({ form, dir = "auto" }: Prop) {
  const bg =
    !form.background || form.background === "transparent"
      ? "transparent"
      : `var(--${form.background})`;

  return (
    <section
      className="resume-section"
      dir={dir}
      style={{ backgroundColor: bg }}
    >
      <div className="resume-section-header">
        {form.icon && <img className="resume-section-icon" src={form.icon} />}
        {form.title && <h1 className="resume-section-title">{form.title}</h1>}
      </div>

      <div className="resume-section-content">
        {form.blocks?.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}
