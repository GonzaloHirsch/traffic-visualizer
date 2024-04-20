import { defineComponent, h } from 'vue';

import { GChart } from 'vue-google-charts';

export const type = 'Sankey';

export const data = [];

export const options = {
  width: 800,
  height: 600,
  link: {
    colorMode: 'gradient'
  },
  node: {
    label: {
      fontSize: 12,
      bold: false
    },
    width: 5,
    nodePadding: 10,
    interactivity: true
  }
};

export default defineComponent({
  name: 'SankeyChart',
  components: {
    GChart
  },
  setup() {
    return () =>
      h(GChart, {
        data,
        options,
        type,
        settings: {
          packages: ['sankey']
        }
      });
  }
});
