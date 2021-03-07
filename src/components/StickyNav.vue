<template>
    <div class="sticky top-0 z-10 flex justify-between shadow-md bg-white">
        <router-link :to="{ name: 'Home' }" class="logo bg-dark-blue text-white text-5xl font-bold italic px-2 py-3">
            HH
        </router-link>
        <div v-if="currentRoom" class="relative">
            <div class="flex items-center h-full pl-8 pr-4 cursor-pointer" @click.stop="showMenu = !showMenu">
                <span class="material-icons">hotel</span>
                <span class="text-dark-gray px-4">{{ currentRoom.name }}</span>
                <span class="material-icons">arrow_drop_down</span>
            </div>
            <nav v-if="showMenu" class="absolute top-full left-0 w-full bg-white cursor-pointer border-solid border-dark-gray border-t">
                <router-link
                    v-for="item in rooms"
                    :key="item.id"
                    :to="{ name: 'RoomDetail', params: { id: item.id } }"
                    replace
                    class="block text-dark-gray pl-8 py-5 hover:bg-light-gray border-solid border-dark-gray border-l border-r border-b"
                >
                    {{ item.name }}
                </router-link>
            </nav>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
    name: 'StickyNav',
    setup () {
        const route = useRoute();
        const store = useStore();

        const showMenu = ref(false);
        const hideMenu = () => {
            showMenu.value = false;
        };
        onMounted(() => {
            document.addEventListener('click', hideMenu);
        });
        onBeforeUnmount(() => {
            document.removeEventListener('click', hideMenu);
        });

        const rooms = computed(() => store.state.rooms);
        const currentRoom = computed(() => rooms.value.find(item => item.id === route.params.id));

        return {
            showMenu,
            rooms,
            currentRoom
        };
    }
};
</script>

<style scoped>
.logo {
    padding: 10px;
    width: 80px;
    height: 72px;
    letter-spacing: -14.35px;
    font-family: Helvetica Neue;
    transform: matrix(1, 0, 0, 1, 0, 0);
}
</style>
