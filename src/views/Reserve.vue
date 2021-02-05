<template>
    <main class="flex-grow mx-auto pt-10 grid grid-cols-2 gap-8">
        <div>
            <h1 class="text-4xl text-darkBlue font-bold">
                Reservation<br>information
            </h1>
            <form @submit.prevent="submitHandler">
                <div class="mt-6" :class="onFocus === 1 ? 'text-lightBlue' : 'text-darkBlue'">
                    <label for="name" class="flex items-center font-bold">
                        <span class="material-icons">perm_identity</span>NAME
                    </label>
                    <input
                        id="name"
                        v-model="name"
                        v-focus
                        type="text"
                        class="border-b border-solid border-darkGray w-full mt-6 focus:outline-none focus:border-lightBlue"
                        required
                        @focus="onFocus = 1"
                        @blur="onFocus = (onFocus === 2) ? 2 : 0"
                    >
                </div>
                <div class="mt-6" :class="onFocus === 2 ? 'text-lightBlue' : 'text-darkBlue'">
                    <label for="tel" class="flex items-center font-bold">
                        <span class="material-icons">phone_android</span>PHONE
                    </label>
                    <input
                        id="tel"
                        v-model="tel"
                        type="text"
                        class="border-b border-solid border-darkGray w-full mt-6 focus:outline-none focus:border-lightBlue"
                        required
                        @focus="onFocus = 2"
                        @blur="onFocus = (onFocus === 1) ? 1 : 0"
                    >
                </div>
                <button class="display py-6 mt-12 text-white text-center bg-lightBlue w-full disabled:opacity-50 disabled:cursor-default" :disabled="disableSubmit">
                    RESERVE NOW
                </button>
            </form>
        </div>
        <ReserveArea
            :show-header="true"
            :readonly="true"
            :show-total="true"
            :show-submit="false"
        />
    </main>
    <FooterBlock :addr="true" />
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import FooterBlock from '/src/components/FooterBlock.vue';
import ReserveArea from '/src/components/ReserveArea.vue';

export default {
    name: 'Reserve',
    components: {
        FooterBlock,
        ReserveArea
    },
    directives: {
        focus: {
            mounted (el) {
                el.focus();
            }
        }
    },
    setup () {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();

        const name = ref('');
        const tel = ref('');
        const onFocus = ref(0);
        const disableSubmit = computed(() => {
            const telRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
            return !name.value || !telRegex.test(tel.value);
        });
        const submitHandler = async () => {
            const data = await store.dispatch('reserve', {
                id: route.params.id,
                name: name.value,
                tel: tel.value,
                date: store.state.newBooking
            });
            if (data) {
                router.push({ name: 'Success' });
            }
        };

        return {
            name,
            tel,
            onFocus,
            disableSubmit,
            submitHandler
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
</style>
