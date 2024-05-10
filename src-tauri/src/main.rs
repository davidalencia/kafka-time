// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use active_win_pos_rs::get_active_window;
use active_win_pos_rs::ActiveWindow;
use std::process::Command;

#[derive(Debug, Clone, Default)]
pub struct ParsableWindow {
    pub process_path: String,
    pub app_name: String,
    pub title: String,
}


impl serde::Serialize for ParsableWindow {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        use serde::ser::SerializeStruct;

        let mut state = serializer.serialize_struct("ActiveWindow", 3)?;
        state.serialize_field("app_name", &self.app_name)?;
        state.serialize_field("process_path", &self.process_path)?;
        state.serialize_field("title", &self.title)?;

        state.end()
    }
}


fn parsable(a: ActiveWindow)-> ParsableWindow{
    ParsableWindow {
        process_path: a.process_path.display().to_string(), 
        app_name: a.app_name,
        title: a.title
    }
}


// [ ] https://tauri.app/v1/guides/features/system-tray/
// [ ] Crear proyecto
// [ ] agregar task a proyecto
// [ ] filtrar por fecha
// [ ] filtrar por proyecto

#[tauri::command]
fn current_app() -> Result<ParsableWindow, ()> {
    // osascript -e 'tell application "System Events" to tell (first process whose frontmost is true) to return {name, name of window 1}'
    let title  = Command::new("osascript")
        .args([
            "-e", 
            "tell application \"System Events\" to tell (first process whose frontmost is true) to return name of window 1"
        ])
        .output()
        .expect("failed to execute process");

    match get_active_window() {
        Ok(active_window) => {
            let mut p_window = parsable(active_window);
            p_window.title = String::from_utf8(title.stdout).unwrap();
            return Ok(p_window)
        },
        Err(()) => {
            return Err(())
        }
    }
    
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![current_app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}