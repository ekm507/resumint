import MiniBox from "./components/MiniBox";

export default function App() {
  const items = { name: "erfan" };
  return (
    <div className="flex flex-row gap-4 p-3 border items-center justify-center h-full">
      <div className="border p-2 flex flex-col items-center justify-center w-max h-full">
        <MiniBox content={items}></MiniBox>
        <MiniBox content={items}></MiniBox>
      </div>
      <div className="border p-2 flex flex-col items-center justify-center w-max h-full">
        <MiniBox content={items}></MiniBox>
        <MiniBox content={items}></MiniBox>
      </div>
    </div>
  );
}
