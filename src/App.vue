<template>
    <router-view />
    <div v-show="loading" class="absolute top-0 z-20 right-0 bottom-0 left-0 flex justify-center items-center bg-white opacity-80">
        <div class="flex flex-col items-center">
            <i class="el-icon-loading text-4xl mb-2" />
            <p class="text-2xl font-bold">
                LOADING
            </p>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'App',
    setup () {
        const store = useStore();

        const loading = computed(() => store.state.loading);
        onMounted(async () => {
            await store.dispatch('getRooms');
        });

        return {
            loading
        };
    }
};
</script>

<style lang="scss">
body {
    font-family: 'Open Sans', sans-serif !important;
}
#app {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    min-height: 100vh;
    width: 1280px;
}
.map {
    height: 352px;
    > div {
        position: relative;
        padding-top: percentage(352/1195);
    }
    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
footer {
    width: 1110px;
}
</style>
