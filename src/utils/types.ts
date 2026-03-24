export type ValueTypeName = "string" | "number" | "array";
export type ValueType = string | number | Array<string | number>;

export type Row = {
  id?: string; // Using string for ID for more flexibility
  name: string;
  valueType?: ValueTypeName;
  value: ValueType;
};

export type FormStructure = {
  id: number;
  title?: string;
  content: Row[];
};

export function GetDefaultValue(type: ValueTypeName) {
  switch (type) {
    case "number":
      return 0;
    case "string":
      return "";
    case "array":
      return [];
  }
}
