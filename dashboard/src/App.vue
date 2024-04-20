<script setup>
import { defineComponent, onUnmounted, ref } from 'vue';
import SankeyChart from './components/Sankey';
import GeoChart from './components/Geo';
import axios from 'axios';
const SankeyChartComponent = defineComponent(SankeyChart);
const GeoChartComponent = defineComponent(GeoChart);

const baseSankeyKeys = ['From', 'To', 'Requests'];
const baseGeoKeys = ['Country', 'Requests'];
const sankeyData = ref([baseSankeyKeys]);
const geoData = ref([baseGeoKeys]);
const fetchData = async () => {
  axios.get('http://localhost:3000/traffic').then((response) => {
    console.log(response.data);
    const newSankeyData = [baseSankeyKeys];
    const newGeoData = [baseGeoKeys];
    // Iterate the response to build the flow.
    Object.keys(response.data.flow).forEach((key) => {
      Object.keys(response.data.flow[key]).forEach((subkey) => {
        // This is the data for sankey, which is FROM, TO, NUMBER
        newSankeyData.push([key, subkey, response.data.flow[key][subkey]]);
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
fetchData();
const interval = setInterval(fetchData, 1000 * 60 * 1);

// Make sure to clear the interval.
onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <SankeyChartComponent :data="sankeyData" />
  <GeoChartComponent :data="geoData" />
</template>

<style>
body {
  background: white;
}
</style>
