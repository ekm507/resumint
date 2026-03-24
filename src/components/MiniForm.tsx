import FormRow from "./FormRow";

interface Prop {
  className?: string;
}

export default function MiniForm({ className = "" }: Prop) {
  return (
    <div className={"border flex flex-col gap-2" + " " + className}>
      <p className="border p-1">this is a form</p>
      <FormRow className="" rowData={{ name: "erfan", value: "20" }}></FormRow>
    </div>
  );
}
