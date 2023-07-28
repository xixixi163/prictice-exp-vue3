<template>
    <div>virtual
        <virtual-accordant
            :list-data="listData"
            :list-height="400"
            :line-height="40"
            :render-child-num="10">

        </virtual-accordant>
    </div>
</template>
<script>
import VirtualAccordant from './components/virtual-accordant/index.vue'
export default {
    components: {
        VirtualAccordant
    },
    data() {
        return {
            listData: [{
                key: 0,
                value: 1
            }, {
                key: 0,
                value: 2
            }]
        }
    },
    methods: {
        getListData() {
            
        }
    }
}
</script>
<style scoped>

</style>

