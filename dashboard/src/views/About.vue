<script setup>
const props = defineProps(['flow', 'countries', 'forceControl']);
</script>

<template>
  <h1 style="margin-top: 0">
    About the
    <a
      href="https://www.npmjs.com/package/traffic-visualizer"
      target="_blank"
      rel="noopener noreferrer"
      >Traffic Visualizer</a
    >
  </h1>
  <p>
    No solutions by Google Cloud allow you to visualize Cloud Run traffic in
    real time. It reduces transparency and your ability to identify malicious
    actors if you limit yourself to using only the Google Cloud service
    offering.
  </p>
  <p>
    This traffic visualizer allows you to visualize Google Cloud Run traffic in
    real-time by looking into the logs your Cloud Run service generates for each
    HTTP request. Using those logs, we generate interactive charts for you to
    understand your cloud traffic in real-time.
  </p>
  <p>
    Think about it this way. You use Google Analytics to track usage of your
    websites, why wouldn't you do the same thing with your services (internal or
    external). The more you can understand about HOW it is being used, you can
    improve more.
  </p>
  <h2>How does it work?</h2>
  <p>
    Cloud Run produces Cloud logging logs with every request it receives. We use
    those logs to gather a snapshot of traffic, aggregate it, get information in
    regarding the location, and present it to you. By using the source IP
    addresses, we can identify a users' rough location using a free IP to
    country & city service. In this case we use http://ip-api.com to get that
    information.
  </p>
  <p>
    Note that this might not reflect your real traffic if users use a proxy or
    VPN, and you might see a bunch of bot traffic sometimes.
  </p>
  <h2>How can you use it?</h2>
  <p>
    These are some of the main uses for this:
    <ul>
      <li><strong>Route discovery</strong>: By using the Sankey, you can understand which routes are being used the most, without needing to set up complex monitoring systems. This provides you a snapshot in less than a minute, and it is real-time.</li>
      <li><strong>Geo discovery</strong>: By using the geo chart, you can find the geographical regions that use your service the most. Knowing that, you can either block the ones that you want to prevent from accessing your services, or you can improve their experience by setting up servers closer to those regions.</li>
      <li><strong>Real-time monitoring</strong>: No Google Cloud Service gives you a real-time snapshot of the usage of all the Cloud Run services you have on a specific project. You can even filter if you need to.</li>
    </ul>
  </p>
  <h2>About the Visualization</h2>
  <p>
    Sankey diagrams are a data visualisation technique or flow diagram that
    emphasizes flow/movement/change from one state to another or one time to
    another in which the width of the arrows is proportional to the flow rate of
    the depicted extensive property.
  </p>
  <p>
    The geo chart allows you have snapshot of the hottest geographical regions
    making use of the services that you have on the specific projects.
  </p>
</template>

<style scoped>
p + p {
  margin-top: 1rem;
}

ul {
  padding-left: 1.5rem;
}
</style>
