export const themeModules = import.meta.glob("./*.css", { eager: true });

export const themeNames = Object.keys(themeModules).map((path) =>
  path.replace("./theme-", "").replace(".css", ""),
);
