import ItemRow from "./ItemRow";

interface Prop {
  form: Form;
}

type Form = {
  title?: string;
  content?: Array<RowData>;
};

type RowData = {
  name?: string;
  value?: number | string | Array<number | string>;
};

export default function MiniBox({ form }: Prop) {
  const rendered = (
    <>
      <div className="formbox flex flex-col gap-1">
        {form?.title && <h1 className="p-1 border">{form.title}</h1>}
        {form?.content &&
          form.content.map((item) => (
            <ItemRow key={item.name} rowData={item} />
          ))}
      </div>
    </>
  );
  return rendered;
}
