<script setup>
import { provide, ref } from 'vue';
const secondsToUpdate = ref(60);
provide('secondsToUpdate', secondsToUpdate);
</script>

<template>
  <nav>
    <div>
      <ul>
        <li class="title"><a href="#">Traffic Visualizer</a></li>
        <li class="option">How does it work?</li>
        <li class="option">About</li>
      </ul>
      <p class="update">Next update in: {{ secondsToUpdate }}s</p>
    </div>
  </nav>
  <main>
    <router-view class="router"></router-view>
  </main>
  <footer>
    <ul>
      <li style="text-align: left">
        Made by
        <a href="https://gonzalohirsch.com" target="_blank" rel="noopener"
          >Gonzalo Hirsch</a
        >
      </li>
      <li style="text-align: center">
        Copyright© {{ new Date().getFullYear() }}
      </li>
      <li style="text-align: right">
        View on
        <a
          href="https://github.com/GonzaloHirsch/traffic-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          >GitHub</a
        >
      </li>
    </ul>
  </footer>
</template>

<style>
/* General */
* {
  padding: 0;
  margin: 0;
  color: #333333;
}
body {
  background: #fdfefe;
  width: 100%;
}
main {
  padding: 1rem 2rem;
}

/* Navigation */
nav {
  position: sticky;
  top: 0;
  background: #fdfefef0;
  z-index: 1;
  border-bottom: 2px solid #333333;
  padding: 0 2rem;
}
nav,
footer {
  color: #333333;
}
nav > div {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
}
footer {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 0;
  border-top: 2px solid #333333;
  margin-top: 1.5rem;
}
nav ul,
footer ul {
  list-style: none;
  padding: 0;
  display: flex;
  width: 100%;
}
nav ul {
  padding: 0.5rem 0;
}
footer ul {
  justify-content: space-between;
}
footer ul li {
  width: 100%;
}
nav ul li {
  width: fit-content;
  font-size: xx-large;
}
nav ul li.title {
  flex: 1 0;
  text-align: left;
}
nav ul li.option {
  flex: 0 1;
  width: fit-content;
  min-width: fit-content;
  margin: 0 0 0 2rem;
}
nav .update {
  font-size: small;
  max-width: fit-content;
  text-align: right;
  margin-left: auto;
  position: absolute;
  right: 0;
  border-radius: 0 0 5px 5px;
  padding: 5px;
  background: #fdfefe;
  font-weight: bold;
  border: 2px solid #333333;
}
nav a {
  text-decoration: none;
  color: inherit;
}
</style>
