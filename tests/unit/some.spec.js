import { createLocalVue, shallowMount } from '@vue/test-utils'
import App from '@/App.vue';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(IconsPlugin)

describe('App.vue (rendering)', () => {
  it('App has data', () => {
    expect(typeof App.data).toBe('function')
  });

  it("Title should render what is expected", () => {
    const msg = "CO2 Emissions";
    const wrapper = shallowMount(App, { localVue });
    expect(wrapper.find('[data-testid="app-title"]').text()).toBe(msg);
  });
})

describe('App.vue (methods)', () => {
  it("'Years' on 'TO' should contain what is expected related to 'FROM'", () => {
    const wrapper = shallowMount(App, { localVue });
    wrapper.vm.from = 2018;
    wrapper.vm.setUpYearsTo();
    var expected = 2018;
    expect(wrapper.vm.yearsTo[0]).toBe(expected);
  });

  it("Should generate correct 'Years FROM' list", () => {
    const wrapper = shallowMount(App, { localVue });
    wrapper.vm.setUpYearsFrom();
    var expectedMin = 1980;
    var expectedMax = 2018;
    expect(wrapper.vm.yearsTo[0]).toBe(expectedMin);
    expect(wrapper.vm.yearsTo[expectedMax - expectedMin]).toBe(expectedMax);
  });

  it("Async axios load data should works", async () => {
    const wrapper = shallowMount(App, { localVue });
    var expectedState = "California";
    await wrapper.vm.loadData(expectedState);
    expect(wrapper.vm.items[0].state).toBe(expectedState);
  });

  it("Should sort correctly by value", () => {
    const wrapper = shallowMount(App, { localVue });

    var value1 = "1 million";
    var value2 = "2 million";

    wrapper.vm.items = [];
    wrapper.vm.items.push({
      value: value1
    });
    wrapper.vm.items.push({
      value: value2
    });  

    wrapper.vm.sortByValue();

    expect(wrapper.vm.items[0].value).toBe(value2);
    expect(wrapper.vm.items[1].value).toBe(value1);
  });
})
