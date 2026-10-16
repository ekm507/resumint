import { useState, useRef, type ChangeEvent, useEffect } from "react";
import DraggableLayout from "./components/DraggableLayout";
import { useReactToPrint } from "react-to-print";
import { useResumeData } from "./hooks/useResumeData";
import { exportResumeData, importResumeData } from "./utils/storage";
import { themeNames } from "./themes";
import { DropdownMenu } from "./components/DropDownMenu";
import { formTemplateOptions } from "./data/formTemplates";
import { generateAccentPalette } from "./utils/theming";
import { FileText, Languages } from "lucide-react";
import TopBarMenu from "./components/TopBarMenu";
import { I18nProvider } from "./i18nContext";
import type { Locale } from "./i18nContext";
import { translations } from "./i18n";

import "./blocks";

export default function App() {
  const { forms, layout, setLayout, setForm, deleteForm, addForm, setForms } =
    useResumeData();

  const [theme, setTheme] = useState("modern");

  const [appLook, setAppLook] = useState<"light" | "dark" | "system">(() => {
    const saved = localStorage.getItem("appLook");
    if (saved === "light" || saved === "dark" || saved === "system")
      return saved;
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("appLook", appLook);
  }, [appLook]);

  const [resolvedLook, setResolvedLook] = useState<string>("colorful");

  useEffect(() => {
    const resolve = () => {
      const dark =
        appLook === "dark" ||
        (appLook === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setResolvedLook(dark ? "colorful-dark" : "colorful");
    };
    resolve();
    if (appLook === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => resolve();
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    return;
  }, [appLook]);

  const [accentColor, setAccentColor] = useState<string | null>(null);
  const accentPalette = accentColor
    ? generateAccentPalette(accentColor)
    : undefined;

  const [isPrinting, setIsPrinting] = useState(false);

  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale");
    return saved === "fa" ? "fa" : "en";
  });

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t = (key: string) =>
    translations[locale]?.[key] ?? translations.en[key] ?? key;

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

  return (
    <I18nProvider locale={locale}>
      <div className="app-root">
        <div className="app-toolbar">
          <button
            className="toolbar-button"
            onClick={() => exportResumeData(forms, layout)}
          >
            {t("app.export")}
          </button>

          <label className="toolbar-button">
            {t("app.import")}
            <input
              type="file"
              accept="application/json"
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

            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {t("settings.appTheme")}
              <select
                value={appLook}
                onChange={(e) =>
                  setAppLook(e.target.value as "light" | "dark" | "system")
                }
              >
                <option value="light">{t("theme.light")}</option>
                <option value="dark">{t("theme.dark")}</option>
                <option value="system">{t("theme.system")}</option>
              </select>
            </label>
          </TopBarMenu>

          <DropdownMenu
            options={formTemplateOptions}
            onChange={(template) => addForm(template)}
            text={t("app.addForm")}
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

        <div
          className="app-layout"
          style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}
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
    </I18nProvider>
  );
}
