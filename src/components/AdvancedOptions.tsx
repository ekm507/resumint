export default function AdvancedOptions({ block, update, children }: any) {
  const advanced = block.props?.__advanced ?? false;

  const toggle = () =>
    update({
      ...block,
      props: {
        ...(block.props || {}),
        __advanced: !advanced,
      },
    });

  return (
    <div className="block-advanced" style={{ position: "relative" }}>
      {!advanced && (
        <button
          className="block-advanced-toggle"
          onClick={toggle}
          title="show advanced options"
        >
          Advanced options ▾
        </button>
      )}

      {advanced && (
        <div className="block-advanced-open block-advanced-floating">
          <div className="block-advanced-controls">{children}</div>

          <button
            className="block-advanced-toggle"
            onClick={toggle}
            title="hide advanced options"
          >
            Hide advanced ▴
          </button>
        </div>
      )}
    </div>
  );
}
