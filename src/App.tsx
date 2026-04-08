import { useState, type ChangeEvent, useRef } from "react";
import MiniForm from "./components/MiniForm";
import type { FormStructure, LayoutItem, Block } from "./utils/types";
import { themeNames } from "./themes";
import DraggableLayout from "./components/DraggableLayout";
import { useReactToPrint } from "react-to-print";
import { downloadBlob } from "./utils/functions";
import { lookNames } from "./looks";
import { generateAccentPalette } from "./utils/theming";

export default function App() {
  // داده‌های نمونه با معماری بلوکی
  const [forms, setForms] = useState<FormStructure[]>([
    {
      id: "0",
      title: "Personal Information",
      blocks: [
        {
          id: "0",
          blockType: "heading",
          props: { text: "name" },
        },
        {
          id: "1",
          blockType: "text",
          props: { text: "Erfan Kheyrollahi" },
        },
        {
          id: "2",
          blockType: "heading",
          props: { text: "Age" },
        },
        {
          id: "3",
          blockType: "text",
          props: { text: "27" },
        },
      ],
    },
    {
      id: "1",
      title: "Properties",
      blocks: [
        {
          id: "0",
          blockType: "heading",
          props: { text: "items in bag" },
        },
        {
          id: "1",
          blockType: "list",
          children: [
            { id: "1-0", blockType: "text", props: { text: "pen" } },
            { id: "1-1", blockType: "text", props: { text: "notebook" } },
            { id: "1-2", blockType: "text", props: { text: "laptop" } },
            { id: "1-3", blockType: "text", props: { text: "tissues" } },
            { id: "1-4", blockType: "text", props: { text: "bicycle keys" } },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "story",
      blocks: [
        {
          id: "0",
          blockType: "text",
          props: {
            text: "once there was a ship on the sea and the name of the ship was billy o tea.",
          },
        },
        {
          id: "1",
          blockType: "text",
          props: {
            text: "soon may the wellerman come. to bring us sugar and tea and rum...",
          },
        },
      ],
    },
  ]);

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
    const last = forms[forms.length - 1];
    const lastID = last ? +last.id : -1;
    const newID = String(lastID + 1);

    const newForm: FormStructure = {
      id: newID,
      title: "",
      blocks: [],
    };

    setForms((prev) => [...prev, newForm]);

    // فعلاً فرم جدید در ستون چپ قرار می‌گیرد
    const column: LayoutItem["column"] = "left";
    setLayout((prev) => [...prev, { id: newID, column }]);
  }

  const [theme, setTheme] = useState("modern");
  const [lookName, setLookName] = useState("neo");
  const [accentColor, setAccentColor] = useState("#16a34a");

  const accentPalette = generateAccentPalette(accentColor);

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
    // توجه: اگر فایل قدیمی با content/rows باشد باید یک مهاجرت بنویسیم
    // فعلاً فرض می‌کنیم داده ورودی با blocks سازگار است.
    const process = async () => {
      const file = event.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      const all_objects = JSON.parse(text);

      // اگر کاربر فایل قدیمی با content فرستاد، اینجا می‌توانید مهاجرت خودکار انجام دهید.
      // مثال ساده (اختیاری):
      // if (all_objects.forms?.[0]?.content && !all_objects.forms?.[0]?.blocks) {
      //   all_objects.forms = migrateContentToBlocks(all_objects.forms);
      // }

      setForms(all_objects.forms);
      setLayout(all_objects.layout);
    };

    process();
  }

  // مثال مهاجرت ساده از content → blocks (اختیاری)
  // function migrateContentToBlocks(oldForms: any[]): FormStructure[] {
  //   return oldForms.map((f, idx) => {
  //     const blocks: Block[] = (f.content || []).flatMap((row: any, i: number) => {
  //       if (row.valueType === "array") {
  //         const listChildren: Block[] = (row.value || []).map((li: any, j: number) => ({
  //           id: `${i}-${j}`,
  //           type: "text",
  //           props: { text: li.value ?? String(li) },
  //         }));
  //         return [
  //           { id: `${i}-heading`, type: "heading", props: { text: row.name || "" } },
  //           { id: `${i}-list`, type: "list", children: listChildren },
  //         ];
  //       }
  //       return [
  //         ...(row.name
  //           ? [{ id: `${i}-heading`, type: "heading", props: { text: row.name } } as Block]
  //           : []),
  //         {
  //           id: `${i}-text`,
  //           type: "text",
  //           props: { text: row.value?.toString?.() ?? "" },
  //         } as Block,
  //       ];
  //     });
  //     return { id: f.id ?? String(idx), title: f.title ?? "", blocks };
  //   });
  // }

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

        <input
          type="color"
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
        />

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
          style={accentPalette as React.CSSProperties}
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
