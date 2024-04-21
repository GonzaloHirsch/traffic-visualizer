<script setup>
import { onUnmounted, ref, computed, inject } from 'vue';
import { GChart } from 'vue-google-charts';
import slider from 'vue3-slider';
import axios from 'axios';

// Controls
const nodeLimit = ref(10);
const minNodes = ref(1);
const maxNodes = ref(nodeLimit.value);
const pattern = ref('');
const secondsToUpdate = inject('secondsToUpdate');

// Times
let countdownInterval;
const showTimer = () => {
  secondsToUpdate.value = Math.max(0, secondsToUpdate.value - 1);
};

// Charts
const baseSankeyKeys = ['From', 'To', 'Requests'];
const baseGeoKeys = ['Country', 'Requests'];
const sankeyData = ref([baseSankeyKeys]);
const geoData = ref([baseGeoKeys]);
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
const fetchData = async (forceControl = false) => {
  // Clear the countdown interval and create another one.
  if (countdownInterval) clearInterval(countdownInterval);
  secondsToUpdate.value = 60;
  countdownInterval = setInterval(showTimer, 1000);

  axios.get('http://localhost:3000/traffic').then((response) => {
    console.log(response.data);
    const newSankeyData = [baseSankeyKeys];
    const newGeoData = [baseGeoKeys];
    // Iterate the response to build the flow.
    Object.keys(response.data.flow).forEach((key) => {
      Object.keys(response.data.flow[key]).forEach((subkey) => {
        // This is the data for sankey, which is FROM, TO, NUMBER
        newSankeyData.push([key, subkey, response.data.flow[key][subkey]]);
        nodeLimit.value = Math.max(
          nodeLimit.value,
          response.data.flow[key][subkey]
        );
        // Only update the max nodes if marked as force.
        if (forceControl) maxNodes.value = nodeLimit.value;
      });
    });
    // Iterate the list of countries to compute it
    response.data.countries.forEach((country) => {
      // Iterate the keys for a country and sum them all.
      let countryTotal = Object.keys(response.data.flow[country]).reduce(
        (total, key) => {
          return total + response.data.flow[country][key];
        },
        0
      );
      newGeoData.push([country, countryTotal]);
    });
    // Map the response to the format.
    sankeyData.value = newSankeyData;
    geoData.value = newGeoData;
    console.log(newGeoData);
  });
};
fetchData(true);
const interval = setInterval(() => fetchData(false), 1000 * 60 * 1);

// Make sure to clear the interval.
onUnmounted(() => {
  if (interval) clearInterval(interval);
  if (countdownInterval) clearInterval(countdownInterval);
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
  <p>
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
