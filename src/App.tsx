import { useState, useRef, type ChangeEvent, useEffect } from "react";
import MiniForm from "./components/MiniForm";
import DraggableLayout from "./components/DraggableLayout";
import { useReactToPrint } from "react-to-print";
import { useResumeData } from "./hooks/useResumeData";
import { exportResumeData, importResumeData } from "./utils/storage";
import { themeNames } from "./themes";
import { DropdownMenu } from "./components/DropDownMenu";
import { formTemplateOptions } from "./data/formTemplates";
import { generateAccentPalette } from "./utils/theming";

import "./blocks";

export default function App() {
  const { forms, layout, setLayout, setForm, deleteForm, addForm, setForms } =
    useResumeData();

  const [theme, setTheme] = useState("modern");

  const lookName = "colorful";

  const [accentColor, setAccentColor] = useState<string | null>(null);
  const accentPalette = accentColor
    ? generateAccentPalette(accentColor)
    : undefined;

  const resumeRef = useRef<HTMLDivElement>(null);

  const printPDF = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: "resume",
  });

  useEffect(() => {
    document.body.classList.remove(
      ...Array.from(document.body.classList).filter((c) =>
        c.startsWith("look-"),
      ),
    );
    document.body.classList.add("look-" + lookName);

    return () => document.body.classList.remove("look-" + lookName);
  }, [lookName]);

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = await importResumeData(file);

    setForms(data.forms);
    setLayout(data.layout);
  }

  useEffect(() => {
    const saved = localStorage.getItem("currentResume");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      setForms(data.forms);
      setLayout(data.layout);
    } catch (err) {
      console.error("Cannot load autosave:", err);
    }
  }, []);

  useEffect(() => {
    const data = { forms, layout };
    localStorage.setItem("currentResume", JSON.stringify(data));
  }, [forms, layout]);

  return (
    <div className="app-root">
      <div className="app-toolbar">
        <button
          className="toolbar-button"
          onClick={() => exportResumeData(forms, layout)}
        >
          Export
        </button>

        <label className="toolbar-button">
          Import
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            hidden
          />
        </label>
        <div className="vdivider" />

        <label className="toolbar-color">
          <span>Accent:</span>
          <input
            type="color"
            value={accentColor ?? "#F0F0F0"}
            onChange={(e) => setAccentColor(e.target.value)}
          />
        </label>

        <button className="toolbar-reset" onClick={() => setAccentColor(null)}>
          Reset
        </button>

        <div className="vdivider" />

        <label>theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {themeNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

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

          <div className="editor-add-button" title="add form">
            <DropdownMenu
              options={formTemplateOptions}
              onChange={(template) => addForm(template)}
              text="add form"
            />
          </div>
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
