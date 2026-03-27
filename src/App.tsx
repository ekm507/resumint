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
      title: "Personal Information",
      content: [
        {
          id: "0",
          name: "name",
          value: "Erfan Kheyrollahi",
          valueType: "string",
        },
        { id: "1", name: "Age", value: 27, valueType: "number" },
      ],
    },
    {
      id: "1",
      title: "Properties",
      content: [
        {
          id: "0",
          name: "items in bag",
          value: [
            { id: "0", value: "pen" },
            { id: "1", value: "notebook" },
            { id: "2", value: "laptop" },
            { id: "3", value: "tissues" },
            { id: "4", value: "bicycle keys" },
          ],
          valueType: "array",
        },
      ],
    },
    {
      id: "2",
      title: "story",
      content: [
        {
          id: "0",
          name: "once there was a ship on the sea and the name of the ship was billy o tea.",
          value: "",
          valueType: "string",
        },
        {
          id: "1",
          name: "",
          value:
            "soon may the wellerman come. to bring us sugar and tea and rum...",
          valueType: "string",
        },
      ],
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
    setLayout((prev) => prev.filter((position) => position.id !== id));
  }

  function addForm() {
    const lastRow = forms[forms.length - 1];
    const lastID = lastRow ? +lastRow.id : -1;
    const newID = String(lastID + 1);

    setForms([
      ...forms,
      { id: newID, title: "", content: [] } as FormStructure,
    ]);

    // const lastLayoutColumn =
    //   layout.find((x) => (x.id = String(lastID)))?.column ?? "left";
    const column = "left";
    setLayout([...layout, { id: newID, column }]);
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
