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
        {(value as { id: string; value: string }[]).map((item) => (
          <div key={item.id} className="resume-array-item">
            {item.value}
          </div>
        ))}
      </div>
    );
  } else if (valueType === "number") {
    valueRender = (
      <div className="resume-item-value resume-item-number">
        {value as number}
      </div>
    );
  } else if (valueType === "string") {
    valueRender = (
      <div className="resume-item-value resume-item-string">
        {value as string}
      </div>
    );
  }

  return (
    <div className="resume-item">
      {name && <div className="resume-item-name">{name}</div>}
      {valueRender}
    </div>
  );
}
