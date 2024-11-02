import { spawnSync } from "child_process";

export function uchardetAvailable(): boolean {
  return !("error" in spawnSync("uchardet"));
}
