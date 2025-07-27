import path from "path";

export function getView(file?: string) {
  const dir = path.join(__dirname, "views");
  return file ? path.join(dir, file) : dir;
}
