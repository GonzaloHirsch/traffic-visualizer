<script setup>
import { ref, computed } from 'vue';
import { GChart } from 'vue-google-charts';
import slider from 'vue3-slider';

const props = defineProps(['flow', 'countries', 'forceControl']);

// Controls
const nodeLimit = ref(10);
const minNodes = ref(1);
const maxNodes = ref(nodeLimit.value);
const pattern = ref('');

// Charts
const baseSankeyKeys = ['From', 'To', 'Requests'];
const baseGeoKeys = ['Country', 'Requests'];
const sankeyData = computed(() => {
  const newSankeyData = [baseSankeyKeys];
  Object.keys(props.flow).forEach((key) => {
    Object.keys(props.flow[key]).forEach((subkey) => {
      // This is the data for sankey, which is FROM, TO, NUMBER
      newSankeyData.push([key, subkey, props.flow[key][subkey]]);
      nodeLimit.value = Math.max(nodeLimit.value, props.flow[key][subkey]);
      // Only update the max nodes if marked as force.
      if (props.forceControl) maxNodes.value = nodeLimit.value;
    });
  });
  return newSankeyData;
});
const geoData = computed(() => {
  const newGeoData = [baseGeoKeys];
  // Iterate the list of countries to compute it
  props.countries.forEach((country) => {
    // Iterate the keys for a country and sum them all.
    let countryTotal = Object.keys(props.flow[country]).reduce((total, key) => {
      return total + props.flow[country][key];
    }, 0);
    newGeoData.push([country, countryTotal]);
  });
  return newGeoData;
});
const visibleSankeyData = computed(() => {
  return sankeyData.value.filter(
    (data) =>
      typeof data[2] === 'string' ||
      (data[2] >= minNodes.value &&
        data[2] <= maxNodes.value &&
        (pattern.value.length <= 0 ||
          new RegExp(pattern.value, 'i').test(data[0] + data[1])))
  );
});
const visibleGeoData = computed(() => {
  return geoData.value;
});
</script>

<template>
  <h1 style="margin-top: 0">Traffic Flow</h1>
  <p>
    Traffic flow is shown based on the following criteria (in order):
    <strong>country</strong>, <strong>city</strong>, <strong>service</strong>,
    and <strong>path</strong>.
  </p>
  <h2>Controls</h2>
  <p>Configure the amount of nodes to be shown:</p>
  <div class="controls-sankey">
    <div style="padding-right: 1rem">
      <span>Minimum Node Traffic (1 - {{ nodeLimit }}) [{{ minNodes }}]</span>
      <slider
        class="sankey-slider"
        v-model="minNodes"
        :min="1"
        :max="nodeLimit"
        :tooltip="true"
        trackColor="#EEEEEE"
        :alwaysShowHandle="true"
        style="margin: 6px 0 0 0"
        :height="15"
      />
    </div>
    <div style="padding-left: 1rem; padding-right: 1rem">
      <span>Maximum Node Traffic (1 - {{ nodeLimit }}) [{{ maxNodes }}]</span>
      <slider
        class="sankey-slider"
        v-model="maxNodes"
        style="margin: 6px 0 0 0"
        :min="1"
        :max="nodeLimit"
        :tooltip="true"
        trackColor="#EEEEEE"
        :alwaysShowHandle="true"
        :height="15"
      />
    </div>
    <div style="padding-left: 1rem">
      <span>Node Pattern (regex)</span>
      <input class="sankey-pattern" style="width: 100%" v-model="pattern" />
    </div>
  </div>
  <GChart
    id="sankey"
    v-if="visibleSankeyData.length > 1"
    :settings="{ packages: ['sankey'] }"
    type="Sankey"
    :data="visibleSankeyData"
    :options="{
      sankey: {
        width: 800,
        height: 800,
        link: {
          colorMode: 'gradient'
        },
        node: {
          label: {
            fontSize: 12,
            bold: false
          },
          width: 5,
          nodePadding: 15,
          interactivity: true
        }
      }
    }"
  />
  <div v-else>
    <p class="error">
      The combination for filters you have selected yields no results, please
      choose another one (or there is no data for this period).
    </p>
  </div>
  <p class="note">
    Note that hiding a node doesn't remove its resulting traffic from the
    diagram, it simply hides it to increase readability. Regex matching is based
    on both ends of the path using keys with the format "[origin][destination]".
    For example the pattern "^(?!.*\/_nuxt\/).*$" ignores all static assets in
    Nuxt.
  </p>
  <h1>Traffic Breakdown per Country</h1>
  <p style="margin-bottom: 1rem">
    This view allows you to identify countries more easily to understand greater
    regions where traffic is coming from.
  </p>
  <GChart
    id="geochart"
    :settings="{ packages: ['geochart'] }"
    type="GeoChart"
    :data="visibleGeoData"
    :options="{
      geochart: {
        width: 800,
        height: 600
      }
    }"
    class="geochart"
  />
</template>

<style>
/* GeoChart */
.geochart {
  max-width: 1000px;
  margin: 0 auto;
}

/* Sankey */
.controls-sankey {
  display: flex;
  margin-bottom: 2rem;
  padding-top: 1rem;
}
.controls-sankey > div {
  width: 100%;
}
.sankey-pattern {
  background: #fdfefe;
}
#sankey {
  height: 500px;
}
</style>
