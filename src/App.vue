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
              <b-form-select
                v-model="from"
                :options="yearsFrom"
                @change="setUpYearsTo"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="1">
            <b-form-group label="To:">
              <b-form-select v-model="to" :options="yearsTo"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="1">
            <b-form-group label="">
              <b-button @click="submit" id="submit">Submit</b-button>
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
      years_max: 2018,
      years_min: 1980,

      items: [],
      fields: [
        { key: "state", label: "State", sortable: true },
        { key: "from" },
        { key: "to" },
        { key: "value", sortable: true },
      ],
      showOverlay: false,
      states: [],

      from: 0, //process.env.VUE_APP_YEAR_MIN,
      to: 0, //process.env.VUE_APP_YEAR_MAX,
      yearsFrom: [],
      yearsTo: [],
    };
  },
  async created() {
    this.setUpYearsFrom();
    this.setUpYearsTo();
  },
  methods: {
    setUpYearsFrom() {
      this.yearsFrom = [];
      for (var i = this.years_min; i <= this.years_max; i++) {
        this.yearsFrom.push(i);
      }
      this.from = this.years_min;
    },
    setUpYearsTo() {
      this.yearsTo = [];
      for (var i = this.from; i <= this.years_max; i++) {
        this.yearsTo.push(i);
      }
      this.to = this.years_max;
    },
    async submit() {
      this.showOverlay = true;
      this.items = [];
      await _axios.get(this.api_url + "/state").then((response) => {
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
          this.api_url + "emission/" + state + "/" + this.from + "/" + this.to
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

#submit {
  margin-top: 30px;
}

select {
  padding: 5px;
}
</style>