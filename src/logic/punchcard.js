import { punchard } from "../logic/db";
import { invoke } from "@tauri-apps/api/core";

export function setupPunchcards() {
  return setInterval(async () => {
    const app = await invoke("current_app");
    console.log(app);
    punchard(app);
  }, 10_000);
}
