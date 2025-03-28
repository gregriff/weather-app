<script setup lang="ts">
import NavBar from '@/views/layout/NavBar.vue';
import Settings from './Settings.vue';
</script>

<template>
    <div class="container-fluid">
        <div class="row justify-content-end">
            <div class="col-4"><NavBar /></div>
            <div class="col-4">
                <div class="float-end"><Settings /></div>
            </div>
        </div>
    </div>

    <div class="container py-4 mx-auto"><slot /></div>
</template>
