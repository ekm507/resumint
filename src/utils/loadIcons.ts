export async function loadAllIcons() {
  // Vite/Rollup pattern – adjust if using Webpack
  const modules = import.meta.glob("/src/assets/icons/*.svg", { eager: true });

  return Object.entries(modules).map(([path, mod]) => {
    const name = path.split("/").pop()!.replace(".svg", "");
    return { name, src: (mod as any).default };
  });
}
