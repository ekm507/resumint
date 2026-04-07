export type ValueTypeName = "string" | "number" | "array" | "image";
export const ValueTypesList = ["string", "number", "array", "image"];
export type ValueType = string | number | { id: string; value: string }[];

export type Row = {
  id: string;
  name: string;
  valueType?: ValueTypeName;
  value: ValueType;
};

export type DirTypeNames = "lrt" | "rtl" | "auto";

export type FormStructure = {
  id: string;
  title: string;
  content: Row[];
};

export type LayoutItem = {
  id: string;
  column: "left" | "right";
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
