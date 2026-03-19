import MiniBox from "./components/MiniBox";

export default function App() {
  const forms = [
    {
      title: "tools",
      content: [
        { name: "plier", value: "nice" },
        { name: "keys", value: 5 },
        { name: "goods", value: ["allen", " a2"] },
      ],
    },
    {
      title: "مهارت‌ها",
      content: [
        { name: "انگلیسی", value: 5 },
        { name: "نقطه‌ی قوت", value: "سر و زبون" },
        { name: "زبان‌ها", value: ["پایتون", "جاوااسکریپت"] },
      ],
    },
  ];
  return (
    <div className="flex flex-row gap-4 p-3 border items-center justify-center h-full text-3xl">
      {forms.map((form) => (
        <div className="border p-2 flex flex-col items-center justify-center w-max h-full">
          <MiniBox key={form.title} form={form} />
        </div>
      ))}
    </div>
  );
}
