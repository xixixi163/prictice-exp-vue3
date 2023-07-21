import VirtualScroll from '../views/virtual-scroll/index.vue'
import Home from '../components/HelloWorld.vue'
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {path: '/', component: Home},
    {path: '/virtual-scroll', component: VirtualScroll}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;