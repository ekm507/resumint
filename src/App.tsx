import { useState, useRef, type ChangeEvent } from "react";
import MiniForm from "./components/MiniForm";
import DraggableLayout from "./components/DraggableLayout";
import { useReactToPrint } from "react-to-print";
import { useResumeData } from "./hooks/useResumeData";
import { exportResumeData, importResumeData } from "./utils/storage";

import { lookNames } from "./looks";
import { themeNames } from "./themes";
import { generateAccentPalette } from "./utils/theming";

import "./blocks";

export default function App() {
  const { forms, layout, setLayout, setForm, deleteForm, addForm, setForms } =
    useResumeData();

  const [theme, setTheme] = useState("modern");
  const [lookName, setLookName] = useState("neo");
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const accentPalette = accentColor
    ? generateAccentPalette(accentColor)
    : undefined;

  const resumeRef = useRef<HTMLDivElement>(null);

  const printPDF = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: "resume",
  });

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = await importResumeData(file);

    setForms(data.forms);
    setLayout(data.layout);
  }

  return (
    <div className={"app-root look-" + lookName}>
      <div className="app-toolbar">
        <button
          className="toolbar-button"
          onClick={() => {
            const panel = document.getElementById("editor-panel");
            if (panel) panel.style.display = "none";
            printPDF();
            if (panel) panel.style.display = "flex";
          }}
        >
          Print
        </button>

        <button
          className="toolbar-button"
          onClick={() => exportResumeData(forms, layout)}
        >
          export data
        </button>

        <input
          type="file"
          accept="application/json"
          className="toolbar-file"
          onChange={handleImport}
        />

        <select value={lookName} onChange={(e) => setLookName(e.target.value)}>
          {lookNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="color"
          value={accentColor ?? "#F0F0F0"}
          onChange={(e) => setAccentColor(e.target.value)}
        />

        <button onClick={() => setAccentColor(null)}>Theme default</button>

        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {themeNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="app-layout">
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
          style={accentPalette as React.CSSProperties | undefined}
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
