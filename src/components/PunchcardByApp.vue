<script setup>
import { ref } from "vue";
import { timeSpent, timeByProjects } from "../logic/db"
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


const data = ref({
  labels: [],
  datasets: [{ data: [] }]
});



async function load() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // greetMsg.value = await getPunchcards()
  let punchcards = await timeByProjects()
  punchcards = punchcards.filter(x => x.name != "loginwindow")
  let labels = punchcards.map(x => x.name)
  let datapoints = punchcards.map(x => x.time / 60 / 60)
  data.value = {
    labels, datasets: [{
      label: "time spent",
      data: datapoints,
      borderColor: '#36A2EB',
      backgroundColor: '#9BD0F5'
    }],
  }
}
load()
</script>

<template>
  <Bar id="my-chart-id" :options="{
    responsive: true
  }" :data="data" />
</template>
