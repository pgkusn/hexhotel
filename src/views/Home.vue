<template>
    <main class="flex-grow">
        <div class="px-20 mt-16">
            <div class="relative">
                <div class="hero">
                    <h1 class="pb-2 text-5xl font-bold italic bg-white text-dark-blue">
                        HexHotel
                    </h1>
                    <div class="absolute top-8 right-0">
                        <ReserveArea :show-room-list="true" />
                    </div>
                </div>
            </div>
        </div>
        <section class="mt-12 px-20 text-dark-gray">
            <h1 class="text-4xl font-bold">
                Recommend
            </h1>
            <h2 class="mb-6">
                You may be interested in our popular rooms
            </h2>
            <div class="grid gap-7 grid-cols-3">
                <router-link
                    v-for="item in recommendRooms"
                    :key="item.id"
                    :to="{ name: 'RoomDetail', params: { id: item.id } }"
                    class="justify-self-center"
                >
                    <img class="room" :src="item.imageUrl" alt="">
                    <p class="text-2xl font-bold text-right">
                        {{ item.name }}
                    </p>
                    <p class="text-right">
                        ${{ format(item.normalDayPrice) }} NTD / night
                    </p>
                </router-link>
            </div>
        </section>
        <div class="banner flex justify-end items-end pr-20 pb-8 mt-12">
            <div>
                <h2 class="text-4xl font-bold text-dark-blue">
                    Reserve the best service
                </h2>
                <p class="text-dark-gray">
                    over 50,000 commendations from our guests
                </p>
            </div>
        </div>
        <section class="grid gap-7 grid-cols-3 px-20 mt-12 text-dark-gray">
            <div>
                <h1 class="text-4xl font-bold">
                    One person
                </h1>
                <p>Enjoy the one and only service</p>
            </div>
            <router-link
                v-for="item in singleRoom"
                :key="item.id"
                :to="{ name: 'RoomDetail', params: { id: item.id } }"
                class="justify-self-center"
            >
                <img class="room" :src="item.imageUrl" alt="">
                <p class="text-2xl font-bold text-right">
                    {{ item.name }}
                </p>
                <p class="text-right">
                    ${{ format(item.normalDayPrice) }} NTD / night
                </p>
            </router-link>
        </section>
        <section class="grid gap-7 grid-cols-3 px-20 mt-12 text-dark-gray">
            <div>
                <h1 class="text-4xl font-bold">
                    Two people
                </h1>
                <p>The perfect choice for both of you</p>
            </div>
            <router-link
                v-for="item in doubleRoom"
                :key="item.id"
                :to="{ name: 'RoomDetail', params: { id: item.id } }"
                class="justify-self-center"
            >
                <img class="room" :src="item.imageUrl" alt="">
                <p class="text-2xl font-bold text-right">
                    {{ item.name }}
                </p>
                <p class="text-right">
                    ${{ format(item.normalDayPrice) }} NTD / night
                </p>
            </router-link>
        </section>
        <section class="grid gap-7 grid-cols-3 px-20 mt-12 text-dark-gray">
            <div>
                <h1 class="text-4xl font-bold">
                    Family
                </h1>
                <p>Wanna a big room? there you are</p>
            </div>
            <router-link
                v-for="item in twinRoom"
                :key="item.id"
                :to="{ name: 'RoomDetail', params: { id: item.id } }"
                class="justify-self-center"
            >
                <img class="room" :src="item.imageUrl" alt="">
                <p class="text-2xl font-bold text-right">
                    {{ item.name }}
                </p>
                <p class="text-right">
                    ${{ format(item.normalDayPrice) }} NTD / night
                </p>
            </router-link>
        </section>
    </main>
    <Gmap />
    <FooterBlock />
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Gmap from '/src/components/Gmap.vue';
import FooterBlock from '/src/components/FooterBlock.vue';
import ReserveArea from '/src/components/ReserveArea.vue';
import format from '/src/format.js';

export default {
    name: 'Home',
    components: {
        Gmap,
        FooterBlock,
        ReserveArea
    },
    setup () {
        const store = useStore();

        const rooms = computed(() => store.state.rooms);
        const recommendRooms = computed(() => {
            const _rooms = Object.assign([], rooms.value);
            const newRooms = [];
            for (let i = 0; i < 3; i++) {
                const ran = Math.floor(Math.random() * _rooms.length);
                newRooms.push(_rooms.splice(ran, 1)[0]);
            }
            return _rooms.length ? newRooms : [];
        });
        const singleRoom = computed(() => rooms.value.filter(item => item.name.includes('Single Room')));
        const doubleRoom = computed(() => rooms.value.filter(item => item.name.includes('Double Room')));
        const twinRoom = computed(() => rooms.value.filter(item => item.name.includes('Twin Room')));

        return {
            recommendRooms,
            singleRoom,
            doubleRoom,
            twinRoom,
            format
        };
    }
};
</script>

<style lang="scss" scoped>
.hero {
    width: 920px;
    height: 352px;
    background-image: url(/src/assets/hero.jpeg);
    background-position: 60% 0;
    > h1 {
        font-family: Helvetica Neue;
        writing-mode: vertical-lr;
    }
}
.room {
    width: 350px;
    height: 240px;
    object-fit: cover;
}
.banner {
    height: 352px;
    background-image: url(/src/assets/hero.jpeg);
    background-position: 50%;
}
</style>
