import { useState, useRef, type ChangeEvent, useEffect } from "react";
import DraggableLayout from "./components/DraggableLayout";
import { useReactToPrint } from "react-to-print";
import { useResumeData } from "./hooks/useResumeData";
import { exportResumeData, importResumeData } from "./utils/storage";
import { themeNames } from "./themes";
import { initialForms, initialLayout } from "./data/initialData";
import { DropdownMenu } from "./components/DropDownMenu";
import { formTemplateOptions } from "./data/formTemplates";
import { generateAccentPalette } from "./utils/theming";
import { FileText, Languages, Plus } from "lucide-react";
import TopBarMenu from "./components/TopBarMenu";
import { I18nProvider } from "./i18nContext";
import type { FormStructure, DropdownOption } from "./utils/types";
import type { Locale } from "./i18nContext";
import { translations } from "./i18n";

import "./blocks";

type StoredDocument = {
  id: string;
  name: string;
  forms: any;
  layout: any;
  updatedAt: number;
};

function createDocument(name: string, forms = initialForms, layout = initialLayout): StoredDocument {
  return {
    id: crypto.randomUUID(),
    name,
    forms: JSON.parse(JSON.stringify(forms)),
    layout: JSON.parse(JSON.stringify(layout)),
    updatedAt: Date.now(),
  };
}

function loadStoredDocuments(): StoredDocument[] {
  try {
    const raw = localStorage.getItem("documents");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
    const legacy = localStorage.getItem("currentResume");
    if (legacy) {
      const data = JSON.parse(legacy);
      return [createDocument("My Resume", data.forms, data.layout)];
    }
  } catch {
    // Fall back to a fresh document below.
  }
  return [createDocument("My Resume")];
}

export default function App() {
  const [documents, setDocuments] = useState<StoredDocument[]>(() =>
    loadStoredDocuments(),
  );
  const [currentId, setCurrentId] = useState<string>(
    () => loadStoredDocuments()[0].id,
  );
  // Keep currentId aligned with loaded docs on first render.
  const currentDocument =
    documents.find((doc) => doc.id === currentId) || documents[0];

  const { forms, layout, setLayout, setForm, deleteForm, addForm, setForms } =
    useResumeData();

  useEffect(() => {
    if (currentDocument) {
      setForms(currentDocument.forms);
      setLayout(currentDocument.layout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [theme, setTheme] = useState("modern");

  const [appLook] = useState<"light">("light");

  useEffect(() => {
    localStorage.setItem("appLook", appLook);
  }, [appLook]);

  const [resolvedLook, setResolvedLook] = useState<string>("colorful");

  useEffect(() => {
    setResolvedLook("colorful");
  }, []);

  const [accentColor, setAccentColor] = useState<string | null>(null);
  const accentPalette = accentColor
    ? generateAccentPalette(accentColor)
    : undefined;

  const [isPrinting, setIsPrinting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale");
    return saved === "fa" ? "fa" : "en";
  });

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t = (key: string) =>
    translations[locale]?.[key] ?? translations.en[key] ?? key;

  useEffect(() => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === currentId
          ? { ...doc, forms, layout, updatedAt: Date.now() }
          : doc,
      ),
    );
  }, [forms, layout, currentId]);

  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("currentDocumentId", currentId);
  }, [currentId]);

  const disabledTemplateTitles = new Set(forms.map((form: any) => form.title));
  const formTemplateOptionsWithState: DropdownOption<FormStructure>[] =
    formTemplateOptions.map((opt: any) => ({
      ...opt,
      disabled:
        Boolean(opt.value?.title) &&
        disabledTemplateTitles.has(opt.value.title),
    }));

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
    document.body.classList.add("look-" + resolvedLook);

    return () => document.body.classList.remove("look-" + resolvedLook);
  }, [resolvedLook]);

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

  const selectDocument = (id: string) => {
    const doc = documents.find((item) => item.id === id);
    if (!doc) return;
    setCurrentId(id);
    setForms(doc.forms);
    setLayout(doc.layout);
  };

  const newDocument = () => {
    const doc = createDocument(t("sidebar.newDocument") || "New document");
    setDocuments((prev) => [doc, ...prev]);
    setCurrentId(doc.id);
    setForms(doc.forms);
    setLayout(doc.layout);
  };

  const duplicateDocument = () => {
    const current = documents.find((doc) => doc.id === currentId);
    if (!current) return;
    const doc = createDocument(
      `${current.name} (copy)`,
      current.forms,
      current.layout,
    );
    setDocuments((prev) => [doc, ...prev]);
    setCurrentId(doc.id);
    setForms(doc.forms);
    setLayout(doc.layout);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => {
      const remaining = prev.filter((doc) => doc.id !== id);
      if (remaining.length === 0) {
        const replacement = createDocument("My Resume");
        remaining.push(replacement);
      }
      if (id === currentId) {
        const next = remaining[0];
        setCurrentId(next.id);
        setForms(next.forms);
        setLayout(next.layout);
      }
      return remaining;
    });
  };

  const renameDocument = () => {
    const current = documents.find((doc) => doc.id === currentId);
    if (!current) return;
    const nextName = window.prompt("Document name", current.name);
    if (!nextName) return;
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === currentId ? { ...doc, name: nextName } : doc,
      ),
    );
  };

  const importDocument = async (file: File) => {
    const data = await importResumeData(file);
    const doc = createDocument(
      file.name.replace(/\\.[^.]+$/, "") || "Imported document",
      data.forms,
      data.layout,
    );
    setDocuments((prev) => [doc, ...prev]);
    setCurrentId(doc.id);
    setForms(doc.forms);
    setLayout(doc.layout);
  };

  const handleSidebarImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await importDocument(file);
    if (event.target) event.target.value = "";
  };

  return (
    <I18nProvider locale={locale}>
      <div className="app-root">
        <div className="app-toolbar">
          <button
            className="toolbar-button"
            onClick={() => setSidebarOpen((value) => !value)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
          <button
            className="toolbar-button"
            onClick={() => void exportResumeData(forms, layout)}
          >
            {t("app.export")}
          </button>

          <label className="toolbar-button">
            {t("app.import")}
            <input
              type="file"
              accept="application/json,.json,application/zip,.zip"
              onChange={handleImport}
              hidden
            />
          </label>
          <div className="vdivider" />

          <TopBarMenu icon={<FileText size={16} />} label={t("app.document")}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {t("settings.theme")}
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                {themeNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {t("settings.accent")}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  title={t("settings.accent")}
                  style={{
                    position: "relative",
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: accentColor ?? "#F0F0F0",
                    cursor: "pointer",
                    overflow: "hidden",
                    padding: 0,
                  }}
                >
                  <input
                    type="color"
                    value={accentColor ?? "#F0F0F0"}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                  />
                </button>
                <button
                  type="button"
                  className="toolbar-button"
                  onClick={() => setAccentColor(null)}
                >
                  {t("settings.reset")}
                </button>
              </div>
            </label>
          </TopBarMenu>

          <TopBarMenu
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
            label={t("app.settings")}
          >            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {t("settings.language")}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Languages size={16} />
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  style={{ flex: 1 }}
                >
                  <option value="en">{t("language.english")}</option>
                  <option value="fa">{t("language.persian")}</option>
                </select>
              </div>
            </label>

          </TopBarMenu>

          <DropdownMenu
            options={formTemplateOptionsWithState}
            onChange={(template) => addForm(template)}
            text={t("app.addForm")}
            icon={<Plus size={16} />}
          />

          <button
            className="toolbar-button"
            onClick={() => {
              setIsPrinting(true);
              window.setTimeout(() => {
                printPDF();
                setIsPrinting(false);
              }, 50);
            }}
          >
            {t("app.print")}
          </button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden", width: "100%" }}>
        {sidebarOpen && (
          <aside className="app-sidebar">
            <div className="sidebar-section">
              <button className="sidebar-button" onClick={newDocument}>
                {t("sidebar.new")}
              </button>
              <button className="sidebar-button" onClick={duplicateDocument} disabled={!currentDocument}>
                {t("sidebar.duplicate")}
              </button>
              <button className="sidebar-button" onClick={renameDocument} disabled={!currentDocument}>
                {t("sidebar.rename")}
              </button>
            </div>

            <div className="sidebar-title">{t("sidebar.documents")}</div>
            <div className="sidebar-document-list">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`sidebar-document ${doc.id === currentId ? "sidebar-document-active" : ""}`}
                  onClick={() => selectDocument(doc.id)}
                >
                  <span className="sidebar-document-name">{doc.name}</span>
                  <button
                    className="sidebar-document-delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteDocument(doc.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="sidebar-section">
              <button className="sidebar-button" onClick={() => document.getElementById("sidebar-import-input")?.click()}>
                {t("app.import")}
              </button>
              <button
                className="sidebar-button"
                onClick={() => void exportResumeData(forms, layout, `${currentDocument?.name || "resume"}.zip`)}
              >
                {t("app.export")}
              </button>
            </div>

            <input
              id="sidebar-import-input"
              type="file"
              hidden
              accept="application/json,.json,application/zip,.zip"
              onChange={handleSidebarImport}
            />
          </aside>
        )}

        <div
          className="app-layout"
          style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", width: "100%", paddingTop: "12px" }}
        >
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
                setForm={setForm}
                deleteForm={deleteForm}
                editable={!isPrinting}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </I18nProvider>
  );
}
