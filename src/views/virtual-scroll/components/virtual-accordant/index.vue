<template>
    <div class="virtual-list-container">
        <div 
            class="virtual-list-body-wrapper body-wrapper"
            style=""
            @scroll="handleScroll"
        >
            <div class="virtual-body-y-space" style="">
                <div class="list-area" style="">
                    <div class="list-item">
                        <slot>
                            index
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'VirtualAccordant',
    props: {
        listData: {
            type: Array,
            default: () => []
        },
        listHeight: {
            type: Number,
            default: 420
        },
        lineHeight: {
            type: Number,
            default: 40
        }
    },
    methods: {
        handleScroll() {

        }
    }
}
</script>
<style scoped>
.virtual-list-container .virtual-list-body-wrapper {
    overflow: auto;
}
.virtual-body-y-space {
    float: left;
    width: 0px;
}
.list-item {
    display: flex;
    align-items: center;
}
</style>