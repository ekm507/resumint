import { useState } from "react";
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
      content: [],
    },
  ] as FormStructure[]);

  function setForm(id, form) {
    setForms((prev) => prev.map((f) => (f.id === id ? form : f)));
  }

  return (
    <div className="flex flex-row gap-8 p-4">
      <div className="flex flex-col text-3xl p-3 border">
        {forms.map((form) => (
          <div
            key={form.id}
            className="border p-1 flex flex-col items-center justify-center w-max h-full"
          >
            <MiniForm initialForm={form} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 p-3 border items-center justify-center h-full text-3xl">
        {forms.map((form, index) => (
          <div
            key={index}
            className="border p-1 flex flex-col items-center justify-center w-max h-full"
          >
            <MiniBox key={form.title} form={form} />
          </div>
        ))}
      </div>
    </div>
  );
}
