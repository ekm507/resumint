import MiniBox from "./components/MiniBox";

export default function App() {
  const forms = [
    {
      title: "tools",
      content: [
        { name: "plier", value: "nice" },
        { name: "keys", value: "allen" },
        { name: "goods", value: ["allen", " a2"] },
      ],
    },
  ];
  const form = forms[0];
  return (
    <div className="flex flex-row gap-4 p-3 border items-center justify-center h-full text-3xl">
      <div className="border p-2 flex flex-col items-center justify-center w-max h-full">
        <MiniBox form={form} />
      </div>
      <div className="border p-2 flex flex-col items-center justify-center w-max h-full"></div>
    </div>
  );
}
