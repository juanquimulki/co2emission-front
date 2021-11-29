<template>
  <div id="app">
    <b-navbar>
      <b-navbar-brand>CO2 Emissions</b-navbar-brand>
    </b-navbar>
    <div class="content">
      <b-overlay :show="showOverlay" rounded="sm">
        <b-card>
          <b-table hover :items="items" :fields="fields"></b-table>
        </b-card>
      </b-overlay>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      items: [],
      fields: [
        { key: "state", label: "State", sortable: true },
        { key: "from" },
        { key: "to" },
        { key: "value", sortable: true },
      ],
      showOverlay: false,
    };
  },
  async created() {
    this.showOverlay = true;
    let i = 0;
    for (i = 1; i <= 10; i++) {
      await this.loadData();
    }
    this.showOverlay = false;
  },
  methods: {
    async loadData() {
      await this.axios
        .get(
          "http://localhost/co2emission-api/public/emission/California/2003/2006"
        )
        .then((response) => {
          console.log(response.data);
          this.items.push(response.data.result[0]);
        });
    },
  },
};
</script>

<style>
body {
  background-color: #ebefc9 !important;
}

.navbar {
  padding-left: 10px;
  background-color: #0b486b;
  box-shadow: 0 4px 10px #888888;
}

.navbar-brand {
  color: white !important;
}

.content {
  padding: 50px;
}

.sr-only {
  display: none !important;
}
</style>