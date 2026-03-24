export type ValueTypeName = "string" | "number" | "array";
export type ValueType = string | number | Array<string | number>;

export type Row = {
  id: string; // Using string for ID for more flexibility
  name: string;
  valueType: ValueTypeName;
  value: ValueType;
};

export type FormStructure = {
  title?: string;
  content: Row[];
};
