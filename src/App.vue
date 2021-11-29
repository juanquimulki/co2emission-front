<template>
  <div id="app">
    <b-navbar>
      <b-navbar-brand>CO2 Emissions</b-navbar-brand>
    </b-navbar>
    <div class="content">
      <b-card>
        <b-row>
          <b-col md="1">
            <b-form-group label="From:">
              <b-form-select v-model="from" :options="years"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="1">
            <b-form-group label="To:">
              <b-form-select v-model="to" :options="years"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="1">
            <b-form-group label="Options:">
              <b-button @click="submit">Submit</b-button>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>

      <b-overlay :show="showOverlay" rounded="sm">
        <b-card>
          <b-table hover :items="items" :fields="fields"></b-table>
        </b-card>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import _axios from "../src/common/apiClient";

export default {
  name: "App",
  components: {},
  data() {
    return {
      api_url: "http://localhost/co2emission-api/public/",

      items: [],
      fields: [
        { key: "state", label: "State", sortable: true },
        { key: "from" },
        { key: "to" },
        { key: "value", sortable: true },
      ],
      showOverlay: false,
      states: [],

      from: 1980, //process.env.VUE_APP_YEAR_MIN,
      to: 2018, //process.env.VUE_APP_YEAR_MAX,
      years: [],
    };
  },
  async created() {
    this.setUpYears();
  },
  methods: {
    setUpYears() {
      for (var i = this.from; i <= this.to; i++) {
        this.years.push(i);
      }
    },
    async submit() {
      this.showOverlay = true;
      this.items = [];
      await _axios
        .get(this.api_url + "/state")
        .then((response) => {
          this.states = response.data.result;
        });

      for (var i = 1; i < this.states.length; i++) {
        await this.loadData(this.states[i]);
      }
      this.showOverlay = false;
    },
    async loadData(state) {
      await _axios
        .get(
          this.api_url + "emission/" +
            state +
            "/" +
            this.from +
            "/" +
            this.to
        )
        .then((response) => {
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

.card {
  margin-bottom: 10px;
}
</style>