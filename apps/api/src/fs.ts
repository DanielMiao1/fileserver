import { readdirSync, lstatSync } from "fs";

interface DirectoryItem {
  name: string;
  is_file: boolean;
}

function trailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

function listDirectory(path: string): DirectoryItem[] {
  const items: DirectoryItem[] = [];

  for (const item of readdirSync(path)) {
    const item_path = path + item;
    const stat = lstatSync(item_path);
    
    items.push({
      name: item,
      is_file: stat.isFile()
    });
  }

  return items;
}

export {
  trailingSlash,
  listDirectory
};
