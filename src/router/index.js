import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Room from '../views/Room.vue';
import RoomDetail from '../views/RoomDetail.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/room/:id',
        name: 'Room',
        component: Room,
        children: [
            {
                path: '',
                name: 'RoomDetail',
                component: RoomDetail
            },
            {
                path: 'reserve',
                name: 'Reserve',
                component: () => import('/src/views/Reserve.vue'),
                beforeEnter (to, from, next) {
                    if (from.name === 'Home' || from.name === 'RoomDetail') {
                        next();
                    }
                    else {
                        next({ name: 'Home' });
                    }
                }
            },
            {
                path: 'success',
                name: 'Success',
                component: () => import('/src/views/Success.vue'),
                beforeEnter (to, from, next) {
                    if (from.name === 'Reserve') {
                        next();
                    }
                    else {
                        next({ name: 'Home' });
                    }
                }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: Home
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior (to, from, savedPosition) {
        return { top: 0 };
    }
});

export default router;
