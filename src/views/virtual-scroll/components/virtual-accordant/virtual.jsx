import { computed, defineComponent, onBeforeUpdate, onUpdated, ref, watchEffect } from 'vue';
import './styles/virtual-list.css';
import { throttle } from '@/utils';
export default defineComponent({
  name: 'VirtualList',
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
    },
    renderChildNum: {
      type: Number,
      default: 10
    }
  },
  setup(props, { slots }) {
    const scrollTop = ref<number>(0);

    const start = ref<number>(0);

    const handleScroll = throttle((e: Event) => {
      scrollTop.value = (e.target as HTMLElement)!.scrollTop;
    }, 16);

    const realList = computed(() => props.listData.slice(start.value, start.value + props.renderChildNum));

    const marginTop = computed(() => start.value * props.lineHeight);

    let lastStartIndex = 0;
    let isLimit = false;

    watchEffect(() => {
      lastStartIndex = scrollTop.value / props.lineHeight >>> 0;
      if (!isLimit && lastStartIndex !== start.value) {
        start.value = lastStartIndex;
      }
    });

    onBeforeUpdate(() => {
      isLimit = true;
    });
    onUpdated(() => {
      isLimit = false;
    });

    return () => (
      <div class="virtual-list-container">
        <div
          class="virtual-list-body-wrapper body-wrapper"
          style={{ maxHeight: `${props.listHeight}px` }}
          onScroll={handleScroll}
        >
          <div class="virtual-body-y-space" style={{ height: `${props.listData.length * props.lineHeight}px` }}></div>
          <div class="list-area" style={{ marginTop: `${marginTop.value}px` }}>
            {realList.value.map((item: any, index: number) => (
              <div class="list-item" key={item.key || index} style={{ height: `${props.lineHeight}px` }}>
                {slots.renderList ? slots.renderList({ listItem: item, index }) : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
});