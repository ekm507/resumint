import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { MobileArrange, MobileSectionEditor } from "./components/MobileWorkspace";
import { useIsMobile, useMobileNavigation } from "./hooks/useMobileNavigation";
import "./mobile.css";
import DraggableLayout from "./components/DraggableLayout";
import { useReactToPrint } from "react-to-print";
import { useResumeData } from "./hooks/useResumeData";
import { exportResumeData, importResumeData } from "./utils/storage";
import { themeNames } from "./themes";
import { initialForms, initialLayout } from "./data/initialData";
import { DropdownMenu } from "./components/DropDownMenu";
import { formTemplateOptions } from "./data/formTemplates";
import { generateAccentPalette } from "./utils/theming";
import {
  FileText,
  Languages,
  Plus,
  FilePlus,
  Copy,
  Upload,
  Download,
  GalleryHorizontal,
} from "lucide-react";
import TopBarMenu from "./components/TopBarMenu";
import { I18nProvider } from "./i18nContext";
import type { FormStructure, DropdownOption } from "./utils/types";
import type { Locale } from "./i18nContext";
import { translations } from "./i18n";

import "./blocks";

function firstDocumentImage(document: any): string {
  for (const form of document?.forms || []) {
    for (const block of form?.blocks || []) {
      const image = firstBlockImage(block);
      if (image) return image;
    }
  }
  return "";
}

function firstBlockImage(block: any): string {
  if (!block) return "";
  if (block.blockType === "image" && typeof block.props?.src === "string") {
    return block.props.src;
  }
  if (Array.isArray(block.props?.columns)) {
    for (const column of block.props.columns) {
      for (const child of column?.children || []) {
        const image = firstBlockImage(child);
        if (image) return image;
      }
    }
  }
  if (Array.isArray(block.children)) {
    for (const child of block.children) {
      const image = firstBlockImage(child);
      if (image) return image;
    }
  }
  return "";
}

function firstDocumentLine(document: any): string {
  for (const form of document?.forms || []) {
    for (const block of form?.blocks || []) {
      const text = firstBlockText(block);
      if (text) return text;
    }
  }
  return "";
}

function firstBlockText(block: any): string {
  if (!block) return "";
  if (block.blockType === "richtext") {
    const content = block.props?.content;
    const found = findFirstText(content);
    if (found) return found;
  }
  if (Array.isArray(block.props?.columns)) {
    for (const column of block.props.columns) {
      for (const child of column?.children || []) {
        const text = firstBlockText(child);
        if (text) return text;
      }
    }
  }
  if (Array.isArray(block.children)) {
    for (const child of block.children) {
      const text = firstBlockText(child);
      if (text) return text;
    }
  }
  return "";
}

function findFirstText(node: any): string {
  if (!node) return "";
  if (typeof node.text === "string" && node.text.trim()) {
    return node.text.trim().split("\\n")[0];
  }
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      const text = findFirstText(child);
      if (text) return text;
    }
  }
  return "";
}

type StoredDocument = {
  id: string;
  name: string;
  forms: any;
  layout: any;
  updatedAt: number;
};

function createDocument(
  name: string,
  forms = initialForms,
  layout = initialLayout,
): StoredDocument {
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
      return [createDocument("", data.forms, data.layout)];
    }
  } catch {
    // Fall back to a fresh document below.
  }
  return [createDocument("")];
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
  const isMobile = useIsMobile();
  const mobileNav = useMobileNavigation(isMobile);
  const [mobileView, setMobileView] = useState<'arrange' | 'preview'>('arrange');
  const [previewZoom, setPreviewZoom] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resize = () => setPreviewWidth(window.innerWidth);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  const previewScale = isMobile && !isPrinting && !previewZoom ? Math.min(1, (previewWidth - 24) / (210 * 96 / 25.4)) : 1;
  const addSection = (template: FormStructure) => {
    const id = addForm(template);
    if (isMobile) mobileNav.open(`edit:${id}`);
  };
  const editingForm = forms.find(form => mobileNav.screen === `edit:${form.id}`);
  useEffect(() => {
    if (isMobile && mobileNav.screen) {
      const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') history.back(); };
      window.addEventListener('keydown', escape);
      return () => window.removeEventListener('keydown', escape);
    }
  }, [isMobile, mobileNav]);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingDocName, setEditingDocName] = useState("");

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
    setEditingDocId(null);
    if (isMobile) mobileNav.close();
    setCurrentId(id);
    setForms(doc.forms);
    setLayout(doc.layout);
  };

  const newDocument = () => {
    const doc = createDocument("", [], []);
    setDocuments((prev) => [doc, ...prev]);
    if (isMobile) mobileNav.close();
    setCurrentId(doc.id);
    setForms(doc.forms);
    setLayout(doc.layout);
  };

  const duplicateDocument = () => {
    const current = documents.find((doc) => doc.id === currentId);
    if (!current) return;
    const baseName =
      current.name || firstDocumentLine(current) || t("sidebar.untitled");
    const doc = createDocument(
      `${baseName} (copy)`,
      current.forms,
      current.layout,
    );
    setDocuments((prev) => [doc, ...prev]);
    if (isMobile) mobileNav.close();
    setCurrentId(doc.id);
    setForms(doc.forms);
    setLayout(doc.layout);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => {
      const remaining = prev.filter((doc) => doc.id !== id);
      if (remaining.length === 0) {
        const replacement = createDocument("");
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

  const importDocument = async (file: File) => {
    const data = await importResumeData(file);
    const doc = createDocument(
      file.name.replace(/\\.[^.]+$/, "") || "Imported document",
      data.forms,
      data.layout,
    );
    setDocuments((prev) => [doc, ...prev]);
    if (isMobile) mobileNav.close();
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
      <div className={`app-root ${isMobile ? 'mobile-app' : ''}`}>
        {isMobile && mobileNav.screen && !editingForm && <button className="mobile-backdrop" aria-label={t('mobile.close')} onClick={mobileNav.close} />}
        {isMobile && <nav inert={Boolean(mobileNav.screen)} className="mobile-bottom-bar" aria-label={t('mobile.navigation')}>
          <button aria-pressed={mobileView === 'arrange'} onClick={() => setMobileView('arrange')}>{t('mobile.arrange')}</button>
          <button aria-pressed={mobileView === 'preview'} onClick={() => setMobileView('preview')}>{t('mobile.preview')}</button>
          <button onClick={() => mobileNav.open('add')}>{t('mobile.add')}</button>
          <button onClick={() => mobileNav.open('gallery')}>{t('sidebar.toggle')}</button>
          <button onClick={() => mobileNav.open('tools')}>{t('mobile.more')}</button>
        </nav>}
        {isMobile && mobileNav.screen === 'add' && <div className="mobile-sheet" role="dialog" aria-modal="true" aria-label={t('app.addForm')} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
          <header><strong>{t('app.addForm')}</strong><button onClick={mobileNav.close}>{t('mobile.close')}</button></header>
          {formTemplateOptionsWithState.map(option => <button key={option.key} disabled={option.disabled} onClick={() => { addSection(option.value); }}>{option.icon}{t(option.label || option.key)}</button>)}
        </div>}
        {isMobile && editingForm && <MobileSectionEditor key={editingForm.id} form={editingForm} onChange={setForm} onClose={mobileNav.close} onDelete={() => { deleteForm(editingForm.id); mobileNav.close(); }} />}
        {isMobile && <div inert={Boolean(mobileNav.screen)} className="mobile-arrange-container" hidden={mobileView !== 'arrange' || isPrinting} dir={locale === 'fa' ? 'rtl' : 'ltr'}><MobileArrange forms={forms} layout={layout} setLayout={setLayout} onOpen={id => mobileNav.open(`edit:${id}`)} /></div>}
        <div role={isMobile ? "dialog" : undefined} aria-modal={isMobile || undefined} aria-label={t("mobile.more")} className={`app-toolbar ${isMobile ? 'mobile-sheet' : ''}`} hidden={isMobile && mobileNav.screen !== 'tools'}>
          {isMobile && <header><strong>{t('mobile.more')}</strong><button onClick={mobileNav.close}>{t('mobile.close')}</button></header>}
          <button
            className="toolbar-button"
            style={{ display: "inline-flex", flexDirection: "row", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
            onClick={() => isMobile ? mobileNav.open("gallery") : setSidebarOpen((value) => !value)}
          >
            <GalleryHorizontal size={16} />
            {t("sidebar.toggle")} {sidebarOpen ? "◀" : "▶"}          </button>
          <div className="vdivider" />

          <TopBarMenu icon={<FileText size={16} />} label={t("app.document")}>
            <label
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {t("settings.theme")}
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                {themeNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {t("settings.accent")}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
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
          >
            {" "}
            <label
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {t("settings.language")}
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
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

          {isMobile ? <button className="toolbar-button" onClick={() => mobileNav.open("add")}>{t("app.addForm")}</button> : <DropdownMenu
            options={formTemplateOptionsWithState}
            onChange={addSection}
            text={t("app.addForm")}
            icon={<Plus size={16} />}
          />}

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

        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            width: "100%",
          }}
        >
          {(isMobile ? mobileNav.screen === "gallery" : sidebarOpen) && (
            <aside className="app-sidebar" role={isMobile ? 'dialog' : undefined} aria-modal={isMobile || undefined} aria-label={t('sidebar.documents')}>
              {isMobile && <header><strong>{t('sidebar.documents')}</strong><button onClick={mobileNav.close}>{t('mobile.close')}</button></header>}
              <div className="sidebar-section">
                <button
                  className="sidebar-button flex items-center gap-2"
                  onClick={newDocument}
                >
                  <FilePlus size={16} />
                  {t("sidebar.new")}
                </button>
              </div>

              <div className="sidebar-title">{t("sidebar.documents")}</div>
              <div className="sidebar-document-list">
                {documents.map((doc) => {
                  const displayName =
                    doc.name || firstDocumentLine(doc) || t("sidebar.untitled");
                  const isEditing = editingDocId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      className={`sidebar-document ${doc.id === currentId ? "sidebar-document-active" : ""}`}
                      onClick={() => selectDocument(doc.id)}
                    >
                      <div className="sidebar-document-thumb">
                        {firstDocumentImage(doc) ? (
                          <img
                            src={firstDocumentImage(doc)}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          firstDocumentLine(doc) ||
                          (doc.name ? doc.name : t("sidebar.untitled"))
                        )}
                      </div>
                      <div className="sidebar-document-body">
                        {doc.id === currentId && isEditing ? (
                          <input
                            className="sidebar-document-input"
                            value={editingDocName}
                            autoFocus
                            onChange={(event) =>
                              setEditingDocName(event.target.value)
                            }
                            onBlur={() => {
                              const nextName = editingDocName.trim();
                              setDocuments((prev) =>
                                prev.map((item) =>
                                  item.id === doc.id
                                    ? { ...item, name: nextName }
                                    : item,
                                ),
                              );
                              setEditingDocId(null);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.currentTarget.blur();
                              }
                              if (event.key === "Escape") {
                                setEditingDocId(null);
                              }
                            }}
                            onClick={(event) => event.stopPropagation()}
                          />
                        ) : (
                          <span
                            className="sidebar-document-name"
                            onClick={(event) => {
                              if (doc.id !== currentId) return;
                              event.stopPropagation();
                              setEditingDocId(doc.id);
                              setEditingDocName(doc.name || "");
                            }}
                          >
                            {displayName}
                          </span>
                        )}
                        {doc.id === currentId && (
                          <div className="sidebar-document-actions">
                            <button
                              className="sidebar-icon-button"
                              title={t("sidebar.duplicate")}
                              onClick={(event) => {
                                event.stopPropagation();
                                duplicateDocument();
                              }}
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        )}
                      </div>
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
                  );
                })}
              </div>

              <div className="sidebar-section sidebar-actions-row">
                <button
                  className="sidebar-button flex items-center gap-2"
                  onClick={() =>
                    document.getElementById("sidebar-import-input")?.click()
                  }
                >
                  <Upload size={16} />
                  {t("app.import")}
                </button>
                <button
                  className="sidebar-button flex items-center gap-2"
                  onClick={() =>
                    void exportResumeData(
                      forms,
                      layout,
                      `${currentDocument?.name || firstDocumentLine(currentDocument) || "resume"}.zip`,
                    )
                  }
                >
                  <Download size={16} />
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
            inert={isMobile && Boolean(mobileNav.screen)}
            className={`app-layout ${isMobile && mobileView !== "preview" && !isPrinting ? "mobile-preview-hidden" : ""}`}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              paddingTop: "12px",
            }}
          >
            {isMobile && mobileView === 'preview' && <p className="mobile-preview-hint">{t('mobile.previewHint')}</p>}
            {isMobile && mobileView === 'preview' && <button className="mobile-preview-zoom" onClick={() => setPreviewZoom(value => !value)}>{t(previewZoom ? 'mobile.fit' : 'mobile.zoom')}</button>}
            <div
              id="resume-render"
              ref={resumeRef}
              className={"resume theme-" + theme}
              style={accentPalette as React.CSSProperties | undefined}
            >
              <div className="resume-page" style={isMobile && !isPrinting ? { zoom: previewScale } : undefined}>
                <DraggableLayout
                  layout={layout}
                  setLayout={setLayout}
                  forms={forms}
                  setForm={setForm}
                  deleteForm={deleteForm}
                  editable={!isPrinting && !isMobile}
                  onOpenSection={isMobile && !isPrinting ? id => mobileNav.open(`edit:${id}`) : undefined}
                  previewScale={previewScale}
                  dragDisabled={isPrinting}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </I18nProvider>
  );
}
