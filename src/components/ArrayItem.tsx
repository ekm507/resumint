interface Props {
  id: string;
  value: string;
  setValue: (id: string, value: string) => void;
  deleteSelf: (id: string) => void;
}

export default function ArrayItem({ id, value, setValue, deleteSelf }: Props) {
  return (
    <div className="editor-array-item-wrapper">
      <input
        value={value}
        className="editor-array-item"
        placeholder="string or number"
        onChange={(e) => {
          setValue(id, e.target.value);
        }}
      />

      <button
        type="button"
        className="editor-array-remove"
        onClick={() => deleteSelf(id)}
      >
        ❌
      </button>
    </div>
  );
}
