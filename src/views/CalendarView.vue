<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { addProject2Punchcards, getProjects, getPunchcards, project } from "../logic/db"


import { Qalendar } from "qalendar";
import dbscan from '@cdxoo/dbscan';


import ScrollPanel from 'primevue/scrollpanel';
import ContextMenu from 'primevue/contextmenu';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown'
import Button from "primevue/button"
import RadioButton from "primevue/radiobutton"
import Panel from "primevue/panel"


const events = ref([])
// const data = ref([])
// const menu = ref()
const projectRadio = ref(null)
const projectInput = ref("")
// const canSaveProject = ref(false)
// const punchcardIdClick = ref()
const projects = ref([])



const canSaveProject = computed(() => {
    if (projectRadio.value === "custom")
        return projectInput.value != ""
    return projectRadio.value != null
})



function formatDate(epoch) {
    function pad(n) {
        return ("" + n).padStart(2, "0")
    }
    let date = new Date(epoch * 1000)
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

onMounted(async () => {
    let cards = (await getPunchcards())

    let scan = dbscan({
        dataset: cards,
        epsilon: 180,
        distanceFunction: (a, b) => Math.abs(a.end - b.start)
    });

    console.log(cards.at(-1))
    let clusters = []
    for (let cl of scan.clusters) {
        let clCards = cards.slice(cl[0], cl.at(-1))
        let card = cards[cl[0]]
        let cardEnd = cards[cl.at(-1)]
        console.log(card)
        clusters.push({
            title: Array.from(new Set(clCards.map(x => x.app))).join(", "),
            time: { start: formatDate(card.start), end: formatDate(cardEnd.end) },
            color: "yellow",
            id: card.punchcardId,
            ids: clCards.map(x => x.punchcardId).join(", "),
            project: card.project,
            isEditable: false,
            isCustom: true,
            description: clCards.map(x => `<li>${(new Date(x.start * 1000)).toLocaleTimeString()} ${x.title}</li>`).join("")
        })
    }

    for (let cl of scan.noise) {
        let card = cards[cl]
        clusters.push({
            title: card.app,
            time: { start: formatDate(card.start), end: formatDate(card.end) },
            color: "blue",
            id: card.punchcardId,
            ids: [card.punchcardId],
            isEditable: false,
            // isCustom: true,
            description: card.title
        })
    }
    events.value = clusters
})

onMounted(async () => {
    console.log(await getProjects())
    projects.value = (await getProjects()).map(x => ({ name: x.name, code: x.projectId }))
})



const saveProject = async (task) => {
    let punchcardIds = task.ids.slice()
    let projectId;
    if (projectRadio.value == "custom") {
        let res = await project({ name: projectInput.value });
        projectId = res.lastInsertId;
    }
    else {
        projectId = projectRadio.value
    }
    console.log(projectId, punchcardIds)

    addProject2Punchcards(projectId, punchcardIds)
}

</script>
<template>
    <div class="card">
        {{ canSaveProject }}
        <Qalendar :events="events" :config="{ eventDialog: { isCustom: true } }">
            <template #weekDayEvent="eventProps">
                <div
                    :style="{ backgroundColor: 'cornflowerblue', color: '#fff', width: '100%', height: '100%', overflow: 'hidden' }">
                    <span class="text-xs">{{ eventProps.eventData.project || eventProps.eventData.title }}</span>

                </div>
            </template>

            <!-- <template #monthEvent="monthEventProps">
                <span>{{ monthEventProps.eventData.title }}</span>
            </template>-->

            <template #eventDialog="props">
                <div v-if="props.eventDialogData && props.eventDialogData.title" class="flex flex-col p-4 gap-2">
                    <h3>{{ props.eventDialogData.title }}</h3>
                    <hr />
                    <ScrollPanel style="width: 100%; height: 100px">
                        <div class="m-0" v-html="props.eventDialogData.description">

                        </div>
                    </ScrollPanel>
                    <hr />
                    <span class="p-text-secondary block mb-1">Select or create a project.</span>
                    <div class="flex flex-col gap-1 mb-4">
                        <div v-for="project in projects" :key="'' + project.code" class="flex items-center">
                            <RadioButton v-model="projectRadio" :inputId="'' + project.code" name="dynamic"
                                :value="project.code" />
                            <label :for="'' + project.code" class="ml-2">{{ project.name }}</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="projectRadio" inputId="custom" name="dynamic" value="custom" />
                            <InputText v-model="projectInput" />
                        </div>
                    </div>

                    <div class="flex justify-content-end gap-2">
                        <Button type="button" label="Cancel" severity="secondary" @click="() => {
                            props.closeEventDialog()
                        }"></Button>
                        <Button type="button" label="Save" :disabled="!canSaveProject" @click="() => {
                            props.closeEventDialog();
                            saveProject(props.eventDialogData)
                        }"></Button>
                    </div>
                </div>
            </template>

        </Qalendar>
    </div>
</template>
<style>
@import "qalendar/dist/style.css";
</style>