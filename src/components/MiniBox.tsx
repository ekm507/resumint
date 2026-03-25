import ItemRow from "./ItemRow";
import type { FormStructure, DirTypeNames } from "../utils/types";

interface Prop {
  form: FormStructure;
  dir?: DirTypeNames;
}

export default function MiniBox({ form, dir = "auto" }: Prop) {
  return (
    <section className="resume-section" dir={dir}>
      {form.title && <h1 className="resume-section-title">{form.title}</h1>}

      <div className="resume-section-content">
        {form.content &&
          form.content.map((item) => <ItemRow key={item.id} row={item} />)}
      </div>
    </section>
  );
}
