<template>
    <main class="flex-grow">
        <div v-if="room" class="pt-10 px-20">
            <div class="relative">
                <div class="hero bg-cover bg-center" :style="{ 'background-image': `url(${currentImageUrl})` }">
                    <h1 class="text-darkBlue bg-white text-4xl font-bold italic pb-2">
                        {{ room.name }}
                    </h1>
                    <p class="text-white bg-darkGray absolute top-0 left-full uppercase py-2">
                        weekday price
                    </p>
                </div>
                <div class="slider-nav grid gap-4 grid-cols-3 mt-4">
                    <div
                        v-for="url in room.imageUrl"
                        :key="url"
                        class="cursor-pointer"
                        @click="currentImageUrl = url"
                    >
                        <img :src="url" alt="">
                    </div>
                </div>
                <div ref="reserveAreaEl" class="reserve-area-container top-32" :class="[isFixed ? 'fixed' : 'absolute', { 'is-fixed-bottom': isFixedBottom }]">
                    <p class="text-darkBlue text-right">
                        <strong class="text-2xl">${{ thousands(room.normalDayPrice) }} NTD</strong> / night
                    </p>
                    <p class="text-sm text-darkGray text-right mb-6">
                        holiday price - ${{ thousands(room.holidayPrice) }} NTD / night
                    </p>
                    <ReserveArea :show-total="true" />
                </div>
            </div>
            <section class="mt-12 w-1/2">
                <h1 class="mb-6 text-xl font-bold text-darkBlue">
                    Description
                </h1>
                <p class="mb-6 text-darkGray">
                    {{ room.descriptionShort.GuestMax }} Guest・{{ room.descriptionShort.Bed.length }} Bed ({{ room.descriptionShort.Bed[0] }})・{{ room.descriptionShort['Private-Bath'] }} Private Bath・{{ room.descriptionShort.Footage }} m²
                </p>
                <p class="mb-6 text-darkGray">
                    {{ room.description }}
                </p>
                <p class="text-darkGray">
                    Check-in is from {{ room.checkInAndOut.checkInEarly }} to {{ room.checkInAndOut.checkInLate }}<br>Check-out is before {{ room.checkInAndOut.checkOut }}
                </p>
            </section>
            <section class="mt-12 w-1/2">
                <h1 class="mb-6 text-xl font-bold text-darkBlue">
                    Amenities
                </h1>
                <ul class="grid grid-cols-3 gap-6">
                    <li class="flex items-center" :class="room.amenities['Wi-Fi'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">wifi</span>
                        <span>Wi-Fi</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Television'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">personal_video</span>
                        <span>Television</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Great-View'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">landscape</span>
                        <span>Great View</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Breakfast'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">restaurant</span>
                        <span>Breakfast</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Air-Conditioner'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">ac_unit</span>
                        <span>Air Conditioner</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Smoke-Free'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">smoke_free</span>
                        <span>Smoke Free</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Mini-Bar'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">local_bar</span>
                        <span>Mini Bar</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Refrigerator'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">kitchen</span>
                        <span>Refrigerator</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Child-Friendly'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">child_care</span>
                        <span>Child-Friendly</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Room-Service'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">room_service</span>
                        <span>Room Service</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Sofa'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">weekend</span>
                        <span>Sofa</span>
                    </li>
                    <li class="flex items-center" :class="room.amenities['Pet-Friendly'] ? 'text-darkGray' : 'text-lightGray'">
                        <span class="material-icons mr-4">pets</span>
                        <span>Pet-Friendly</span>
                    </li>
                </ul>
            </section>
        </div>
    </main>
    <Gmap />
    <VueFooter />
</template>

<script>
import { ref, watch, onMounted, onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { throttle } from 'lodash';
import Gmap from '/src/components/Gmap.vue';
import VueFooter from '/src/components/VueFooter.vue';
import ReserveArea from '/src/components/ReserveArea.vue';
import thousands from '/src/thousands.js';

export default {
    name: 'RoomDetail',
    components: {
        Gmap,
        VueFooter,
        ReserveArea
    },
    setup () {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const room = ref(null);
        const currentImageUrl = ref('');
        const booking = computed(() => store.state.booking);
        const getRoomDetail = async () => {
            if (!route.params.id) return;
            const data = await store.dispatch('getRoomDetail', route.params.id);
            if (data) {
                room.value = data;
                currentImageUrl.value = data.imageUrl[0];
            }
            else {
                alert('No information found.');
                router.push({ name: 'Home' });
            }
        };
        watch(() => route.params.id, getRoomDetail);
        onMounted(() => {
            getRoomDetail();
            window.addEventListener('scroll', scrollHandler);
        });
        onBeforeMount(() => {
            window.removeEventListener('scroll', scrollHandler);
        });

        // fixed reserveArea
        const reserveAreaEl = ref({});
        const isFixed = ref(false);
        const isFixedBottom = ref(false);
        const scrollHandler = throttle(() => {
            const fixedBottomPos = 630;
            isFixed.value = window.scrollY >= reserveAreaEl.value?.offsetTop && window.scrollY < fixedBottomPos;
            isFixedBottom.value = window.scrollY > fixedBottomPos;
        });

        return {
            room,
            booking,
            currentImageUrl,
            thousands,
            reserveAreaEl,
            isFixed,
            isFixedBottom
        };
    }
};
</script>

<style lang="scss" scoped>
.hero {
    position: relative;
    width: 825px;
    height: 480px;
    > h1,
    > p {
        writing-mode: vertical-lr;
    }
}
.slider-nav {
    width: 512px;
    img {
        width: 160px;
        height: 94px;
        object-fit: cover;
    }
}
.reserve-area-container {
    right: calc(50% - 560px);
    &.is-fixed-bottom {
        top: 630px;
    }
}
</style>
