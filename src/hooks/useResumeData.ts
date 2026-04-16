import { useState } from "react";
import type { FormStructure, LayoutItem } from "../utils/types";
import { initialForms, initialLayout } from "../data/initialData";

export function useResumeData() {
  const [forms, setForms] = useState<FormStructure[]>(initialForms);
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout);

  function setForm(id: string, form: FormStructure) {
    setForms((prev) => prev.map((f) => (f.id === id ? form : f)));
  }

  function deleteForm(id: string) {
    setForms((prev) => prev.filter((f) => f.id !== id));
    setLayout((prev) => prev.filter((l) => l.id !== id));
  }

  function addForm(template?: FormStructure, layout?: "left" | "right") {
    const newID = crypto.randomUUID();

    const newForm: FormStructure = template
      ? {
          ...template,
          id: newID,
          blocks: template.blocks ? [...template.blocks] : [],
        }
      : {
          id: newID,
          title: "",
          blocks: [],
        };

    const formLayout = layout || "left";
    setForms((prev) => [...prev, newForm]);
    setLayout((prev) => [...prev, { id: newID, column: formLayout }]);
  }

  return {
    forms,
    layout,
    setLayout,
    setForm,
    deleteForm,
    addForm,
    setForms,
  };
}
