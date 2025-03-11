import { join } from "path";
import { existsSync, lstatSync, mkdirSync, readdirSync } from "fs";

const srv_dir = (() => {
  const env = process.env.SRV;

  if (!env) {
    const path = join(process.cwd(), "srv");

    if (!existsSync(path)) {
      mkdirSync(path);
    }

    return path;
  }

  return env;
})();

function trailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

function sanitizePath(path: string): string | false {
  const absolute = join(srv_dir, path);

  if (!absolute.startsWith(srv_dir)) {
    return false;
  }

  return absolute;
}

function isFile(path: string): string {
  const absolute = sanitizePath(path);

  if (!absolute) {
    return "\u0000";
  }

  const stat = lstatSync(absolute);

  return String.fromCodePoint(+stat.isFile());
}

function listDirectory(path: string): string {
  const absolute = sanitizePath(path);

  if (!absolute) {
    return "";
  }

  let items = "";

  for (const item of readdirSync(absolute)) {
    const item_path = absolute + item;
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
  isFile,
  trailingSlash,
  listDirectory
};
