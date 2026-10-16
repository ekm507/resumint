import type { Block } from "../utils/types";
import { registerBlock } from "./blockRegistry";
import AdvancedOptions from "../components/AdvancedOptions";
import ToggleButton from "../components/ToggleButton";
import { useI18n } from "../i18nContext";
export function DividerEditor({ block, update }: any) {
  const { t } = useI18n();
  const { style = "solid", spacing = "md" } = block.props || {};

  const setProp = (k: string, v: any) =>
    update({
      ...block,
      props: { ...(block.props || {}), [k]: v },
    });

  return (
    <div className="divider-block-editor">
      <hr
        className={`divider-block divider-style-${style} divider-spacing-${spacing}`}
      />

      <AdvancedOptions block={block} update={update}>
        <div className="options-grid">
          <div className="option-group">
            <label>{t("divider.style")}</label>
            <ToggleButton
              value={style}
              onChange={(v) => setProp("style", v)}
              options={[
                { value: "solid", label: t("divider.solid") },
                { value: "dashed", label: t("divider.dashed") },
                { value: "dotted", label: t("divider.dotted") },
              ]}
            />
          </div>

          <div className="option-group">
            <label>{t("divider.spacing")}</label>
            <ToggleButton
              value={spacing}
              onChange={(v) => setProp("spacing", v)}
              options={[
                { value: "sm", label: t("divider.small") },
                { value: "md", label: t("divider.medium") },
                { value: "lg", label: t("divider.large") },
              ]}
            />
          </div>
        </div>
      </AdvancedOptions>
    </div>
  );
}

export function DividerRender({ block }: any) {
  const { style = "solid", spacing = "md" } = block.props || {};

  return (
    <div
      className="divider-block-render"
      style={{ padding: "0.75rem 0", cursor: "pointer" }}
    >
      <hr
        className={`divider-block divider-style-${style} divider-spacing-${spacing}`}
      />
    </div>
  );
}

registerBlock({
  type: "divider",
  label: "block.divider",

  create(): Block {
    return {
      id: "",
      blockType: "divider",
      props: {
        style: "solid",
        spacing: "md",
      },
    };
  },

  Editor: DividerEditor,
  Render: DividerRender,
});
