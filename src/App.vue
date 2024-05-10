<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Database from "@tauri-apps/plugin-sql";
import { onBeforeMount } from "vue";

import Greet from "./components/Greet.vue";
import PunchcardByApp from "./components/PunchcardByApp.vue";
import { setupPunchcards } from "./logic/punchcard";

const punchcardsIntervalId = setupPunchcards();

onBeforeMount(()=>clearInterval(punchcardsIntervalId))


// --------------reset--------------------
async function reset(){
  const db = await Database.load("sqlite:test.db");
  const result = await db.execute(`
  DROP TABLE IF EXISTS punchcards;
  DROP TABLE IF EXISTS apps;
  DROP TABLE IF EXISTS tasks;
  DROP TABLE IF EXISTS projects;
  CREATE TABLE apps (
    appId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    command TEXT
  );
  CREATE TABLE projects (
    projectId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  );
  CREATE TABLE tasks (
    taskId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    projectId INTEGER,
    FOREIGN KEY(projectId) REFERENCES projects(projectId)
  );
  CREATE TABLE punchcards (
    punchcardId INTEGER PRIMARY KEY AUTOINCREMENT,
    taskId INTEGER,
    appId INTEGER NOT NULL,
    start INTEGER NOT NULL,
    end INTEGER,
    FOREIGN KEY(appId) REFERENCES apps(appId),
    FOREIGN KEY(taskId) REFERENCES tasks(taskId)
  );
`);
console.log(result)
}
// reset()

</script>

<template>
  <div class="container">
    <h1>Welcome to Kafka time!</h1>
    <PunchcardByApp/>
    <Greet />
  </div>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
