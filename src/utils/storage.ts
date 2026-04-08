import { downloadBlob } from "./functions";
import type { FormStructure, LayoutItem } from "./types";

export function exportResumeData(
  forms: FormStructure[],
  layout: LayoutItem[],
  filename = "thecv_data.json",
) {
  const data = { forms, layout };

  const blob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });

  downloadBlob(blob, filename);
}

export async function importResumeData(file: File) {
  const text = await file.text();
  return JSON.parse(text);
}
