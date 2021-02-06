import { createStore } from 'vuex';
import router from '../router';
import axios from 'axios';

axios.defaults.baseURL = 'https://challenge.thef2e.com/api/thef2e2019/stage6';
axios.defaults.headers.common.Authorization = import.meta.env.VITE_API_TOKEN;
axios.defaults.headers.common.accept = 'application/json';

const store = createStore({
    state () {
        return {
            loading: false,
            rooms: [],
            room: null,
            booking: null,
            newBooking: [],
            checkInAndOut: {
                checkIn: null,
                checkOut: null
            },
            contactInfo: null
        };
    },
    mutations: {
        setLoading (state, value) {
            state.loading = value;
        },
        setRooms (state, rooms) {
            state.rooms = rooms;
        },
        setRoom (state, room) {
            state.room = room;
        },
        setBooking (state, date) {
            state.booking = date;
        },
        setNewBooking (state, date) {
            state.newBooking = date;
        },
        setCheckInAndOut (state, payload) {
            state.checkInAndOut[payload.type] = payload.value;
        },
        setContactInfo (state, payload) {
            state.contactInfo = payload;
        }
    },
    actions: {
        async getRooms ({ commit }) {
            try {
                const { data } = await axios('/rooms');
                if (data.success) {
                    commit('setRooms', data.items);
                }
            }
            catch (error) {
                console.error(error.message);
            }
        },
        async getRoomDetail ({ commit }, id) {
            try {
                const { data } = await axios(`/room/${id}`);
                if (data.success) {
                    commit('setRoom', data.room[0]);
                    commit('setBooking', data.booking.map(item => item.date));
                }
            }
            catch (error) {
                alert('No information found.');
                router.push({ name: 'Home' });
            }
        },
        async reserve ({ commit }, payload) {
            const { id, name, tel, date } = payload;
            try {
                const { data } = await axios.post(`/room/${id}`, { name, tel, date });
                if (data.success) {
                    commit('setContactInfo', { name, tel });
                    return data.room;
                }
            }
            catch (error) {
                console.error(error.message);
            }
        }
    }
});

axios.interceptors.request.use(function (config) {
    store.commit('setLoading', true);
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    store.commit('setLoading', false);
    return response;
}, function (error) {
    store.commit('setLoading', false);
    return Promise.reject(error);
});

export default store;
