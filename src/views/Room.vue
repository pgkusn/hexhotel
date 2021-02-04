<template>
    <StickyNav />
    <router-view />
</template>

<script>
import StickyNav from '/src/components/StickyNav.vue';

export default {
    name: 'Room',
    components: {
        StickyNav
    }
};
</script>

<style>

</style>
