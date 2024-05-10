<script setup>
import { ref } from "vue";
import { timeSpent} from "../logic/db"

const greetMsg = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // greetMsg.value = await getPunchcards()
  greetMsg.value = await timeSpent()

}
</script>

<template>

    <button @click="greet">Greet</button>

  <p>{{ greetMsg }}</p>
</template>
