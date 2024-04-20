import { defineComponent, h } from 'vue';

import { GChart } from 'vue-google-charts';

export const type = 'GeoChart';

export const data = [];

export const options = {
  width: 800,
  height: 600
};

export default defineComponent({
  name: 'GeoChart',
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
          packages: ['geochart']
        }
      });
  }
});
