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

  function addForm() {
    const last = forms[forms.length - 1];
    const lastID = last ? +last.id : -1;
    const newID = String(lastID + 1);

    const newForm: FormStructure = {
      id: newID,
      title: "",
      blocks: [],
    };

    setForms((prev) => [...prev, newForm]);
    setLayout((prev) => [...prev, { id: newID, column: "left" }]);
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
