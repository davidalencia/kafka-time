<script setup>
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { ref } from "vue"

const nodes = ref([
    {
        key: 0,
        label: "test1",
        data: { name: "hola", },
        children: [
            { key: 0 - 0, label: "test0.1", data: "https://www.google.com", type: 'url' },
            { key: 0 - 1, label: "test0.2", data: "https://www.google.com", type: 'url' },
            { key: 0 - 2, label: "test0.3", data: "https://www.google.com", type: 'url' },
            { key: 0 - 3, label: "test0.4", data: "https://www.google.com", type: 'url' }
        ]
    },
    {
        key: 1,
        label: "test2",
        children: [
            { key: 1 - 0, label: "test1.1", data: "https://www.google.com", type: 'url' },
            { key: 1 - 1, label: "test1.2", data: "https://www.google.com", type: 'url' },
            { key: 1 - 2, label: "test1.3", data: "https://www.google.com", type: 'url' },
            { key: 1 - 3, label: "test1.4", data: "https://www.google.com", type: 'url' }
        ]
    },
])

</script>
<template>
    <!-- <TreeTable :value="nodes">
        <Column field="name" header="Name" expander></Column>
        <Column field="size" header="Size"></Column>
        <Column field="type" header="Type"></Column>
    </TreeTable> -->
</template>