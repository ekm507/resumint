import { useState, type ChangeEvent } from "react";
import MiniBox from "./components/MiniBox";
import MiniForm from "./components/MiniForm";

import type { FormStructure } from "./utils/types";

export default function App() {
  const [forms, setForms] = useState([
    {
      id: "0",
      title: "tools",
      content: [
        { id: "0", name: "plier", valueType: "string", value: "nice" },
        { id: "1", name: "keys", valueType: "number", value: 5 },
        { id: "2", name: "goods", valueType: "array", value: ["allen", " a2"] },
      ],
    },
    {
      id: "1",
      title: "مهارت‌ها",
      content: [
        { id: "0", name: "انگلیسی", valueType: "number", value: 5 },
        {
          id: "1",
          name: "نقطه‌ی قوت",
          valueType: "string",
          value: "سر و زبون",
        },
        {
          id: "2",
          name: "زبان‌ها",
          valueType: "array",
          value: ["پایتون", "جاوااسکریپت"],
        },
      ],
    },
    {
      id: "2",
      title: "",
      content: [],
    },
  ] as FormStructure[]);

  function setForm(id: string, form: FormStructure) {
    setForms((prev) => prev.map((f) => (f.id === id ? form : f)));
  }

  function deleteForm(id: string) {
    setForms((prev) => prev.filter((form) => form.id !== id));
  }

  function addForm() {
    const lastRow = forms[forms.length - 1];
    const lastID = lastRow ? +lastRow.id : -1;
    setForms([
      ...forms,
      { id: String(lastID + 1), title: "", content: [] } as FormStructure,
    ]);
  }

  function exportData(filename: string = "thecv_data.json") {
    const text = JSON.stringify(forms);
    const blob = new Blob([text], { type: "Application/json" });
    const link = document.createElement("a");
    link.style.display = "hidden";
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function importData(event: ChangeEvent<HTMLInputElement>) {
    // TODO check if json is in intended format
    const process = async () => {
      const file = event.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const data = JSON.parse(text);
      setForms(data);
    };
    process();
  }

  return (
    <div className="flex flex-col gap-1 justify-center items-center border">
      <div className="flex flex-row gap-4 border text-xl">
        <button
          className="bg-amber-500 hover:cursor-pointer p-3"
          onClick={() => {
            exportData();
          }}
        >
          export data
        </button>
        <input
          type="file"
          className="bg-cyan-500 hover:cursor-pointer p-3"
          accept="application/json"
          onChange={importData}
        />
      </div>

      <div className="flex flex-row gap-8 p-4">
        <div className="flex flex-col text-3xl p-3 border">
          {forms.map((form) => (
            <div
              key={form.id}
              className="border p-1 flex flex-col items-center justify-center w-max h-full"
            >
              <MiniForm
                form={form}
                onFormChange={setForm}
                onDelete={deleteForm}
              />
            </div>
          ))}
          <button className="border hover:cursor-pointer" onClick={addForm}>
            {" "}
            +{" "}
          </button>
        </div>
        <div className="flex flex-col gap-4 p-3 border items-center justify-center h-full text-3xl">
          {forms.map((form) => (
            <div
              key={form.id}
              className="border p-1 flex flex-col items-center justify-center w-max h-full"
            >
              <MiniBox form={form} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
