import { useState, type ChangeEvent } from "react";
import MiniForm from "./components/MiniForm";
import type { FormStructure, LayoutItem } from "./utils/types";
import { themeNames } from "./themes";
import DraggableLayout from "./components/DraggableLayout";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { downloadBlob } from "./utils/functions";
import { lookNames } from "./looks";
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

  const [layout, setLayout] = useState<LayoutItem[]>([
    { id: "0", column: "left" },
    { id: "1", column: "right" },
    { id: "2", column: "left" },
  ]);

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

  const [theme, setTheme] = useState("modern");
  const [lookName, setLookName] = useState("neo");

  function exportData(filename: string = "thecv_data.json") {
    const all_objects = {
      forms,
      layout,
    };
    const text = JSON.stringify(all_objects);
    const blob = new Blob([text], { type: "Application/json" });

    downloadBlob(blob, filename);
  }

  function importData(event: ChangeEvent<HTMLInputElement>) {
    // TODO check if json is in intended format
    const process = async () => {
      const file = event.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      const all_objects = JSON.parse(text);

      setForms(all_objects.forms);
      setLayout(all_objects.layout);
    };

    process();
  }

  const resumeRef = useRef<HTMLDivElement>(null);

  const printPDF = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: "resume",
  });

  return (
    <div className={"app-root " + "look-" + lookName}>
      <div className="app-toolbar">
        <button
          className="toolbar-button"
          onClick={() => {
            const a = document.getElementById("editor-panel");
            if (a) a.style.display = "none";
            printPDF();
            if (a) a.style.display = "flex";
          }}
        >
          Print
        </button>
        <button className="toolbar-button" onClick={() => exportData()}>
          export data
        </button>

        <input
          type="file"
          accept="application/json"
          className="toolbar-file"
          onChange={importData}
        />
        <select
          value={lookName}
          onChange={(e) => {
            setLookName(e.target.value);
          }}
        >
          {lookNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
          }}
        >
          {themeNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="app-layout">
        {/* FORM EDITOR */}
        <div className="editor-panel" id="editor-panel">
          {forms.map((form) => (
            <div key={form.id} className="editor-form-wrapper">
              <MiniForm
                form={form}
                onFormChange={setForm}
                onDelete={deleteForm}
              />
            </div>
          ))}

          <button className="editor-add-button" onClick={addForm}>
            +
          </button>
        </div>

        <div
          id="resume-render"
          ref={resumeRef}
          className={"resume theme-" + theme}
        >
          <div className="resume-page">
            <DraggableLayout
              layout={layout}
              setLayout={setLayout}
              forms={forms}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
