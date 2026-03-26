export const lookModules = import.meta.glob("./*.css", { eager: true });

export const lookNames = Object.keys(lookModules).map((path) =>
  path.replace("./look-", "").replace(".css", ""),
);
