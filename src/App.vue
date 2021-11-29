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
          <table>
            <thead>
              <tr>
                <th scope="col" class="order" @click="sortByState()">
                  State (sortable)
                </th>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col" class="order" @click="sortByValue()">
                  Value (sortable)
                </th>
                <th scope="col">Options</th>
              </tr>
            </thead>
            <draggable v-model="items" tag="tbody">
              <tr v-for="item in items" :key="item.state">
                <td scope="row">{{ item.state }}</td>
                <td>{{ item.from }}</td>
                <td>{{ item.to }}</td>
                <td>{{ item.value }}</td>
                <td><b-icon id="drag" icon="arrows-move"></b-icon></td>
              </tr>
            </draggable>
          </table>
          <!-- <vue-good-table :columns="fields" :rows="items" :isDraggable="true"></vue-good-table> -->
          <!-- <b-table hover :items="items" :fields="fields"></b-table> -->
        </b-card>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import _axios from "../src/common/apiClient";
import draggable from "vuedraggable";

export default {
  name: "App",
  components: { draggable },
  data() {
    return {
      API_URL: "http://localhost/co2emission-api/public/",
      YEARS_MAX: 2018,
      YEARS_MIN: 1980,

      items: [],
      fields: [
        { field: "state", sortable: true },
        { field: "from" },
        { field: "to" },
        { field: "value", sortable: true },
      ],
      showOverlay: false,
      states: [],

      from: 0, //process.env.VUE_APP_YEAR_MIN,
      to: 0, //process.env.VUE_APP_YEAR_MAX,
      yearsFrom: [],
      yearsTo: [],

      sortState: "asc",
      sortValue: "desc",
    };
  },
  async created() {
    this.setUpYearsFrom();
    this.setUpYearsTo();
  },
  methods: {
    setUpYearsFrom() {
      this.yearsFrom = [];
      for (var i = this.YEARS_MIN; i <= this.YEARS_MAX; i++) {
        this.yearsFrom.push(i);
      }
      this.from = this.YEARS_MIN;
    },
    setUpYearsTo() {
      this.yearsTo = [];
      for (var i = this.from; i <= this.YEARS_MAX; i++) {
        this.yearsTo.push(i);
      }
      this.to = this.YEARS_MAX;
    },
    async submit() {
      this.showOverlay = true;
      this.items = [];
      await _axios.get(`${this.API_URL}state`).then((response) => {
        this.states = response.data.result;
      });

      for (var i = 1; i < this.states.length; i++) {
        await this.loadData(this.states[i]);
      }
      this.showOverlay = false;
    },
    async loadData(state) {
      await _axios
        .get(`${this.API_URL}emission/${state}/${this.from}/${this.to}`)
        .then((response) => {
          this.items.push(response.data.result[0]);
        });
    },
    sortByState() {
      if (this.sortState == "asc") {
        this.sortState = "desc";
        this.items.sort(function (a, b) {
          var nameA = a.state.toUpperCase(); // ignore upper and lowercase
          var nameB = b.state.toUpperCase(); // ignore upper and lowercase
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });
      } else {
        this.sortState = "asc";
        this.items.sort(function (a, b) {
          var nameA = a.state.toUpperCase(); // ignore upper and lowercase
          var nameB = b.state.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });
      }
    },
    sortByValue() {
      if (this.sortValue == "asc") {
        this.sortValue = "desc";
        this.items.sort(function (a, b) {
          var valueA = parseFloat(a.value);
          var valueB = parseFloat(b.value);
          return valueA - valueB;
        });
      } else {
        this.sortValue = "asc";
        this.items.sort(function (a, b) {
          var valueA = parseFloat(a.value);
          var valueB = parseFloat(b.value);
          return valueB - valueA;
        });
      }
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
  padding: 10px;
}

#submit {
  margin-top: 30px;
}

select {
  padding: 5px;
}

table {
  width: 100%;
}

table td {
  padding: 10px;
}

table th {
  padding: 10px;
}

table tr {
  border-bottom: 1px solid lightgrey;
}

#drag {
  cursor: move;
}

.order {
  cursor: pointer;
}
</style>