<template>
    <main class="flex-grow mx-auto py-10">
        <h1 class="text-4xl text-dark-blue font-bold">
            Reservation<br>received!
        </h1>
        <div class="my-12 text-dark-blue">
            <dl class="flex flex-wrap border-t border-b border-solid border-light-gray py-6">
                <dt class="font-bold">
                    GUEST
                </dt>
                <dd>
                    {{ name }}
                </dd>
                <dt class="font-bold mt-4">
                    PHONE
                </dt>
                <dd class="mt-4">
                    {{ tel }}
                </dd>
            </dl>
            <dl class="flex flex-wrap border-b border-solid border-light-gray py-6">
                <dt class="font-bold">
                    ROOM
                </dt>
                <dd>
                    {{ roomName }} / {{ bookingCount }} Nights
                </dd>
            </dl>
            <dl class="flex flex-wrap border-b border-solid border-light-gray py-6">
                <dt class="font-bold">
                    CHECK-IN
                </dt>
                <dd>
                    {{ checkIn }}
                </dd>
                <dt class="font-bold mt-4">
                    CHECK-OUT
                </dt>
                <dd class="mt-4">
                    {{ checkOut }}
                </dd>
            </dl>
        </div>
        <button class="btn-back btn-main block mx-auto" @click="back">
            HOMEPAGE
        </button>
    </main>
    <FooterBlock :addr="true" />
</template>

<script>
import { useStore } from 'vuex';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import dayjs from 'dayjs';
import FooterBlock from '/src/components/FooterBlock.vue';

export default {
    name: 'Success',
    components: {
        FooterBlock
    },
    setup () {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const name = store.state.contactInfo.name;
        const tel = store.state.contactInfo.tel;
        const roomName = store.state.rooms.find(item => item.id === route.params.id).name;
        const bookingCount = store.state.newBooking.length;
        const checkIn = dayjs(store.state.checkInAndOut.checkIn).format('YYYY-MM-DD');
        const checkOut = dayjs(store.state.checkInAndOut.checkOut).format('YYYY-MM-DD');
        const back = () => {
            router.replace({ name: 'Home' });
        };
        onBeforeRouteLeave(() => {
            store.commit('setCheckInAndOut', { type: 'checkIn', value: null });
            store.commit('setCheckInAndOut', { type: 'checkOut', value: null });
        });

        return {
            name,
            tel,
            roomName,
            bookingCount,
            checkIn,
            checkOut,
            back
        };
    }
};
</script>

<style scoped>
main {
    width: 730px;
}
h1 {
    line-height: 54px;
}
dt {
    width: 190px;
}
dd {
    width: calc(100% - 190px);
}
.btn-back {
    width: 350px;
}
</style>
