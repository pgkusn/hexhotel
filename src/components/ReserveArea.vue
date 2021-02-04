<template>
    <div class="reserve-area relative text-darkBlue bg-white border-solid border-darkGray border-t">
        <template v-if="props.showHeader">
            <div class="border-solid border-darkGray border-l border-r border-b">
                <img :src="room?.imageUrl" alt="" class="room-img">
            </div>
            <div class="px-8 py-6 border-solid border-darkGray border-l border-r border-b font-bold text-xl text-darkBlue">
                {{ room?.name }}
            </div>
        </template>
        <div
            v-if="props.roomList"
            class="relative flex items-center px-8 py-6 border-solid border-darkGray border-l border-r border-b"
            @click.stop="showMenu = !showMenu"
        >
            <span class="material-icons pointer-events-none">hotel</span>
            <span class="ml-4 pointer-events-none" :class="room?.name ? 'text-darkBlue' : 'text-darkGray'">{{ room?.name || 'ROOM' }}</span>
            <span class="material-icons pointer-events-none ml-auto">arrow_drop_down</span>
            <ul v-show="showMenu" class="room-menu absolute z-10 bg-white">
                <li
                    v-for="item in rooms"
                    :key="item.id"
                    class="text-darkGray pl-8 py-5 hover:bg-lightGray border-solid border-darkGray border-l border-r border-b"
                    @click="roomId = item.id"
                >
                    <span class="pointer-events-none">{{ item.name }}</span>
                </li>
            </ul>
        </div>
        <div class="date-picker flex items-center px-8 py-6 border-solid border-darkGray border-l border-r border-b" :class="{ 'is-focus': onFocus === 1 }">
            <span class="material-icons pointer-events-none">date_range</span>
            <el-date-picker
                v-model="choiceCheckIn"
                type="date"
                :clearable="false"
                :disabled-date="disabledDate"
                :readonly="props.readonly"
                @focus="onFocus = 1"
                @blur="onFocus = (onFocus === 2) ? 2 : 0"
                @change="onCheckInChange"
            />
            <span v-show="onFocus !== 1" class="date-picker__label absolute text-darkGray pointer-events-none">CHECK-IN</span>
            <span v-show="onFocus !== 1 && !choiceCheckIn" class="material-icons pointer-events-none ml-auto">arrow_drop_down</span>
        </div>
        <div class="date-picker flex items-center px-8 py-6 border-solid border-darkGray border-l border-r border-b" :class="{ 'is-focus': onFocus === 2 }">
            <span class="material-icons pointer-events-none">date_range</span>
            <el-date-picker
                v-model="choiceCheckOut"
                type="date"
                :clearable="false"
                :disabled-date="disabledDate"
                :readonly="props.readonly"
                @focus="onFocus = 2"
                @blur="onFocus = (onFocus === 1) ? 1 : 0"
                @change="onCheckOutChange"
            />
            <span v-show="onFocus !== 2" class="date-picker__label absolute text-darkGray pointer-events-none">CHECK-OUT</span>
            <span v-show="onFocus !== 2 && !choiceCheckOut" class="material-icons pointer-events-none ml-auto">arrow_drop_down</span>
        </div>
        <div v-show="props.showTotal && !disableSubmit" class="px-8 py-6 border-solid border-darkGray border-l border-r border-b">
            <dl class="flex flex-wrap mb-6">
                <dt v-show="dayCount.normalDay" class="w-1/2 text-darkGray">
                    ${{ thousands(room?.normalDayPrice) }} × {{ dayCount.normalDay }} night
                </dt>
                <dd v-show="dayCount.normalDay" class="w-1/2 text-right text-darkGray">
                    ${{ normalDaySubtotal }}
                </dd>
                <dt v-show="dayCount.holiday" class="w-1/2 mt-2 text-darkGray">
                    ${{ thousands(room?.holidayPrice) }} × {{ dayCount.holiday }} night
                </dt>
                <dd v-show="dayCount.holiday" class="w-1/2 mt-2 text-right text-darkGray">
                    ${{ holidaySubtotal }}
                </dd>
            </dl>
            <dl class="flex flex-wrap border-solid border-lightGray border-t pt-6">
                <dt class="w-1/2 text-darkBlue">
                    TOTAL
                </dt>
                <dd class="w-1/2 text-right text-darkBlue font-bold">
                    ${{ total }}
                </dd>
            </dl>
        </div>
        <button
            v-if="props.showSubmit"
            class="display py-6 text-white text-center bg-lightBlue w-full disabled:opacity-50 disabled:cursor-default"
            :disabled="disableSubmit"
            @click="submitHandler"
        >
            RESERVE NOW
        </button>
    </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { intersection } from 'lodash';
import thousands from '/src/thousands.js';

export default {
    name: 'ReserveArea',
    props: {
        showHeader: {
            type: Boolean,
            default: false
        },
        roomList: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        showTotal: {
            type: Boolean,
            default: false
        },
        showSubmit: {
            type: Boolean,
            default: true
        }
    },
    setup (props) {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        // show/hide menu
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

        // disabled & submit
        const booking = computed(() => store.state.booking);
        const disabledDate = time => {
            const isSameOrBefore = dayjs(time).isSameOrBefore(dayjs(), 'date');
            const isBooking = booking.value.includes(dayjs(time).format('YYYY-MM-DD'));
            return isSameOrBefore || isBooking;
        };
        const disableSubmit = computed(() => {
            if (props.roomList) {
                return !booking.value || !choiceCheckIn.value || !choiceCheckOut.value || (checkInTime.value >= checkOutTime.value);
            }
            else {
                return !choiceCheckIn.value || !choiceCheckOut.value || (checkInTime.value >= checkOutTime.value);
            }
        });
        const submitHandler = () => {
            const booked = intersection(newBooking.value, booking.value);
            if (booked.length) {
                alert(`Sorry, ${booked} sold out.`);
                return;
            }
            store.commit('setNewBooking', newBooking.value);
            router.push({ name: 'Reserve', params: { id: roomId.value } });
        };

        // room info
        const roomId = ref(null);
        if (!props.roomList) {
            roomId.value = route.params.id;
        }
        const rooms = computed(() => store.state.rooms);
        const room = computed(() => rooms.value.find(item => item.id === roomId.value));

        // 從首頁直接訂房，選擇房型時 ajax 取得已預訂日期
        watch(roomId, async (value) => {
            if (!props.roomList) return;
            await store.dispatch('getRoomDetail', value);
        });

        // check in/out
        const choiceCheckIn = ref(null);
        const choiceCheckOut = ref(null);
        const checkInAndOut = computed(() => store.state.checkInAndOut);
        const checkInTime = computed(() => checkInAndOut.value.checkIn?.getTime());
        const checkOutTime = computed(() => checkInAndOut.value.checkOut?.getTime());
        const onFocus = ref(0);
        const onCheckInChange = value => {
            store.commit('setCheckInAndOut', { type: 'checkIn', value });
        };
        const onCheckOutChange = value => {
            store.commit('setCheckInAndOut', { type: 'checkOut', value });
        };
        choiceCheckIn.value = store.state.checkInAndOut.checkIn;
        choiceCheckOut.value = store.state.checkInAndOut.checkOut;

        // 訂房日期、天數、價格
        const newBooking = ref([]);
        const dayCount = computed(() => {
            newBooking.value.length = 0;
            let normalDay = 0;
            let holiday = 0;
            const oneDayTime = 1000 * 60 * 60 * 24;
            for (let time = checkInTime.value; time < checkOutTime.value; time += oneDayTime) {
                newBooking.value.push(dayjs(time).format('YYYY-MM-DD'));
                if (dayjs(time).day() > 0 && dayjs(time).day() < 6) {
                    normalDay++;
                }
                else {
                    holiday++;
                }
            }
            return { normalDay, holiday };
        });
        const normalDaySubtotal = computed(() => room.value?.normalDayPrice * dayCount.value.normalDay);
        const holidaySubtotal = computed(() => room.value?.holidayPrice * dayCount.value.holiday);
        const total = computed(() => normalDaySubtotal.value + holidaySubtotal.value);

        return {
            props,
            route,
            showMenu,
            rooms,
            roomId,
            room,
            choiceCheckIn,
            choiceCheckOut,
            checkInTime,
            checkOutTime,
            onFocus,
            disabledDate,
            disableSubmit,
            onCheckInChange,
            onCheckOutChange,
            dayCount,
            normalDaySubtotal,
            holidaySubtotal,
            total,
            newBooking,
            submitHandler,
            thousands
        };
    }
};
</script>

<style lang="scss" scoped>
.reserve-area {
    width: 350px;
}
.room-img {
    width: 100%;
    height: 204px;
    object-fit: cover;
}
.room-menu {
    top: calc(100% + 1px);
    right: -1px;
    left: -1px;
}
.date-picker {
    &__label {
        left: calc(24px + 3rem);
    }
    :deep(.el-input) {
        width: 100%;
        font-size: 16px;
        line-height: 1;
    }
    :deep(.el-input__inner) {
        padding: 0 0 0 1rem;
        height: auto;
        border: none;
        color: #2d3643;
        text-align: right;
        line-height: 1;
        @at-root {
            .date-picker.is-focus :deep(.el-input__inner) {
                text-align: left;
            }
        }
    }
    :deep(.el-input__inner::placeholder) {
        color: #748290;
    }
    :deep(.el-input__prefix) {
        display: none;
    }
}
</style>
