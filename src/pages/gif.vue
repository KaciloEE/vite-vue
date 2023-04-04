<template>
  <div>
    <router-link to="/">Back Home Page</router-link>
    <br>
    <h2>{{ item.title }}</h2>
    <img
      :src="item?.images?.fixed_height?.url"
      :height="item?.images?.fixed_height?.height"
      :width="item?.images?.fixed_height?.width"
      alt=""
    />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      item: {},
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/${this.$route.params.id}?api_key=XQJsiGIND0fn0MgbDhlEPcgKxR7DykpN`
        );

        const data = await response.json();
        this.item = data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
// https://api.giphy.com/v1/gifs/G0OM2OGY2F6i0rfE1g?api_key=XQJsiGIND0fn0MgbDhlEPcgKxR7DykpN
</script>

<style lang="scss" scoped></style>
