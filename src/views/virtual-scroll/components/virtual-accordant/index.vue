<template>
    <div class="virtual-list-container">
        <!-- 虚拟列表的高度 -->
        <div 
            class="virtual-list-body-wrapper body-wrapper"
            :style="{maxHeight: `${listHeight}px`}"
            @scroll="handleScroll"
        >
        <!-- 滚动区域占位 -->
            <div class="virtual-body-y-space" :style="{height: `${listData.length * lineHeight}px`}"></div>
            <div class="list-area" style="">
                <div v-for="(item, index) in realList" :key="item.key" class="list-item">
                    <slot>
                        {{ item }}---{{ index }}
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'VirtualAccordant',
    props: {
        // 无限数组
        listData: {
            type: Array,
            default: () => []
        },
        // 列表高度
        listHeight: {
            type: Number,
            default: 420
        },
        // 列表项高度
        lineHeight: {
            type: Number,
            default: 40
        },
        // 一屏渲染个数
        renderChildNum: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            start: 0, // 滚动开始的位置
            scrollTop: 0, // 向上滚动的高度
        }
    },  
    computed: {
        // 获取一屏的数据
        realList() {
            return this.listData.slice(this.start, this.start + this.renderChildNum)
        },
        // 顶部预留位置
        marginTop() {
            return this.start * this.lineHeight
        }
    },
    methods: {
        handleScroll(e) {
            this.scrollTop = e.target.scrollTop;
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