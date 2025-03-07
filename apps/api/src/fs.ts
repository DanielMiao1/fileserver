import { readdirSync, lstatSync } from "fs";

function trailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

function listDirectory(path: string): string {
  let items = "";

  for (const item of readdirSync(path)) {
    const item_path = path + item;
    const stat = lstatSync(item_path);
    
    let data = String.fromCodePoint(+stat.isFile()) + item;

    if (data.length > 1114111) {
      data = data.slice(0, 1114111);
    }

    items += String.fromCodePoint(data.length) + data;
  }

  return items;
}

export {
  trailingSlash,
  listDirectory
};
