import ItemRow from "./ItemRow";
import type { FormStructure, DirTypeNames } from "../utils/types";

interface Prop {
  form: FormStructure;
  dir?: DirTypeNames;
}

export default function MiniBox({ form, dir = "auto" }: Prop) {
  const rendered = (
    <div className="formbox flex flex-col gap-1" dir={dir}>
      {form.title && <h1 className="p-1 border">{form.title}</h1>}
      {form.content &&
        form.content.map((item) => <ItemRow key={item.id} row={item} />)}
    </div>
  );
  return rendered;
}
