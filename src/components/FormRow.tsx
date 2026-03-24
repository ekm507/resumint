interface Props {
  rowData: {
    name?: string;
    value?: number | string | Array<string | number>;
  };
  className?: string;
}

export default function FormRow({ rowData, className = "" }: Props) {
  const { name = "a", value = "b" } = rowData;
  let valueRender;
  if (Array.isArray(value)) {
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
      <input
        key="value"
        type="number"
        placeholder="numberic value"
        className="ItemString text-amber-800 border p-1"
      />
    );
  } else if (typeof value == "string") {
    valueRender = (
      <input
        key="value"
        placeholder="string value"
        className="ItemString text-blue-800 border p-1"
      />
    );
  }
  return (
    <div
      className={"ItemRow flex flex-row gap-1 p-1 border " + " " + className}
    >
      <input
        key="name"
        placeholder="item name"
        className="itemName border p-1"
      />
      {valueRender}
    </div>
  );
}
