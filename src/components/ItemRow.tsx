import type { Row } from "../utils/types";

interface Props {
  row: Row;
}

export default function ItemRow({ row }: Props) {
  const { name, value, valueType } = row;

  let valueRender;

  if (valueType === "array") {
    valueRender = (
      <div className="resume-item-value resume-item-array">
        {(value as Array<number | string>).map((item) => (
          <div key={item} className="resume-array-item">
            {item}
          </div>
        ))}
      </div>
    );
  } else if (valueType === "number") {
    valueRender = (
      <div className="resume-item-value resume-item-number">{value}</div>
    );
  } else if (valueType === "string") {
    valueRender = (
      <div className="resume-item-value resume-item-string">{value}</div>
    );
  }

  return (
    <div className="resume-item">
      {name && <div className="resume-item-name">{name}</div>}
      {valueRender}
    </div>
  );
}
