import ItemRow from "./ItemRow";
import type { FormStructure } from "../utils/types";

interface Prop {
  form: FormStructure;
}

export default function MiniBox({ form }: Prop) {
  const rendered = (
    <div className="formbox flex flex-col gap-1">
      {form.title && <h1 className="p-1 border">{form.title}</h1>}
      {form.content &&
        form.content.map((item) => <ItemRow key={item.id} row={item} />)}
    </div>
  );
  return rendered;
}
