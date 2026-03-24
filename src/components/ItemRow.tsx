import type { Row } from "../utils/types";

interface Props {
  row: Row;
}

export default function ItemRow({ row }: Props) {
  const { name, value, valueType } = row;
  let valueRender;
  if (valueType === "array") {
    valueRender = (
      <div className="ItamArray flex flex-col gap-1 border p-1">
        {value.map((item) => (
          <div key={item} className="ItemArrayItem text-cyan-800 border">
            {item}
          </div>
        ))}
      </div>
    );
  } else if (typeof value == "number") {
    valueRender = (
      <div className="ItemNumber text-amber-800 border p-1">{value}</div>
    );
  } else if (typeof value == "string") {
    valueRender = (
      <div className="ItemString text-blue-800 border p-1">{value}</div>
    );
  }
  return (
    <>
      <div className="ItemRow flex flex-row gap-1 p-1 border ">
        {name && <div className="itemName border p-1">{name}</div>}
        {valueRender}
      </div>
    </>
  );
}
