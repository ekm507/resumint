import type React from "react";

interface Props {
  rowData: {
    name?: string;
    value?: number | string | Array<string | number>;
  };
}

export default function ItemRow({ rowData }: Props) {
  const { name, value } = rowData;
  let valueRender;
  if (Array.isArray(value)) {
    valueRender = (
      <div className="ItamArray flex flex-col gap-1 border p-1">
        {value.map((item) => (
          <div key={item} className="ItemArrayItem border">
            {item}
          </div>
        ))}
      </div>
    );
  } else if (typeof value == "number") {
    valueRender = <div className="ItemNumber border p-1">{value}</div>;
  } else if (typeof value == "string") {
    valueRender = <div className="ItemString border p-1">{value}</div>;
  }
  return (
    <>
      <div className="ItemRow flex flex-row gap-1 p-2 border ">
        {name && <div className="itemName border p-1">{name}</div>}
        {valueRender}
      </div>
    </>
  );
}
