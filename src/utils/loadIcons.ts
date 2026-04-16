export function loadAllIcons() {
  // Recursively load all SVG icons from any subfolder
  const modules = import.meta.glob("/src/assets/icons/**/*.svg", {
    eager: true,
  });

  return Object.entries(modules).map(([path, mod]) => {
    // Example path: /src/assets/icons/ui/forms/add.svg
    const relative = path.replace("/src/assets/icons/", "").replace(".svg", "");
    // Example relative: ui/forms/add

    const name = relative.split("/").pop()!; // "add"

    return {
      name, // filename only
      path: relative, // folder path + name
      src: (mod as any).default,
    };
  });
}

export function category_icons(category: string) {
  const loadedIcons = loadAllIcons();

  const filteredIcons = category
    ? loadedIcons.filter(
        (i) => i.path === category || i.path.startsWith(category + "/"),
      )
    : loadedIcons;

  const icons = Object.fromEntries(
    filteredIcons.map((icon) => [icon.name, icon.src]),
  );
  return icons;
}
