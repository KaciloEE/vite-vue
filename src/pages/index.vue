<template>
  <div class="main-wrapper">
    <div class="container">
      <div class="header">
        <img class="header__logo" src="../assets/logo.svg" alt="" />
        <v-text-field
          v-model="search"
          class="header__search"
          label="Search..."
          hide-details="auto"
        ></v-text-field>
      </div>
      <div class="content">
        <div class="content-container" style="color: #fff">
          <router-link
            :to="`/gif/${item.id}`"
            class="content__item"
            style="color: #fff"
            v-for="(item, index) in list"
            :key="index"
          >
            <a
              :href="`http://twitter.com/share?&url=${item.url}&title=${item.title}&hashtags=javascript,programming`"
              target="_blank"
              style="color: #fff"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="2500"
                height="2500"
                viewBox="126.444 2.281 589 589"
              >
                <circle cx="420.944" cy="296.781" r="294.5" fill="#2daae1" />
                <path
                  d="M609.773 179.634c-13.891 6.164-28.811 10.331-44.498 12.204 16.01-9.587 28.275-24.779 34.066-42.86a154.78 154.78 0 0 1-49.209 18.801c-14.125-15.056-34.267-24.456-56.551-24.456-42.773 0-77.462 34.675-77.462 77.473 0 6.064.683 11.98 1.996 17.66-64.389-3.236-121.474-34.079-159.684-80.945-6.672 11.446-10.491 24.754-10.491 38.953 0 26.875 13.679 50.587 34.464 64.477a77.122 77.122 0 0 1-35.097-9.686v.979c0 37.54 26.701 68.842 62.145 75.961-6.511 1.784-13.344 2.716-20.413 2.716-4.998 0-9.847-.473-14.584-1.364 9.859 30.769 38.471 53.166 72.363 53.799-26.515 20.785-59.925 33.175-96.212 33.175-6.25 0-12.427-.373-18.491-1.104 34.291 21.988 75.006 34.824 118.759 34.824 142.496 0 220.428-118.052 220.428-220.428 0-3.361-.074-6.697-.236-10.021a157.855 157.855 0 0 0 38.707-40.158z"
                  fill="#fff"
                /></svg
            ></a>
            <img
              :src="item?.images?.fixed_height?.url"
              :height="item?.images?.fixed_height?.height"
              :width="item?.images?.fixed_height?.width"
              alt=""
            />
          </router-link>
        </div>
        <div ref="observer" class="observer"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      search: "",
      list: [],
      count: 24,
      totalCount: 0,
      method: "trending",
    };
  },
  watch: {
    search(val) {
      this.searchData(val);
      if (!val) {
        this.method = "trending";
      } else {
        this.method = "search";
      }
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/trending?api_key=XQJsiGIND0fn0MgbDhlEPcgKxR7DykpN&limit=${this.count}&rating=g`
        );

        const data = await response.json();
        this.list = data.data;
        this.totalCount = data.pagination.total_count;
      } catch (error) {
        console.log(error);
      }
    },
    async loadMoreData() {
      try {
        this.count += 12;
        if (this.count > this.totalCount) this.count = this.totalCount;

        let response;
        if (this.method == "trending") {
          response = await fetch(
            `https://api.giphy.com/v1/gifs/trending?api_key=XQJsiGIND0fn0MgbDhlEPcgKxR7DykpN&limit=${this.count}&rating=g`
          );
        } else if (this.method == "search") {
          response = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=XQJsiGIND0fn0MgbDhlEPcgKxR7DykpN&q=${this.search}&limit=${this.count}&offset=0&rating=g&lang=en`
          );
        }

        const data = await response.json();
        this.list = [...this.list, ...data.data];
        this.totalCount = data.pagination.total_count;
      } catch (error) {
        console.log(error);
      }
    },
    async searchData(val: string) {
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=XQJsiGIND0fn0MgbDhlEPcgKxR7DykpN&q=${val}&limit=24&offset=0&rating=g&lang=en`
        );

        const data = await response.json();
        this.list = data.data;
        this.totalCount = data.pagination.total_count;

        if (!this.list.length) {
          const response = await fetch(
            `https://api.giphy.com/v1/gifs/random?api_key=XQJsiGIND0fn0MgbDhlEPcgKxR7DykpN&tag=not+found&rating=g`
          );
          const data = await response.json();
          this.list = [data.data];
          this.totalCount = data.pagination.total_count;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.fetchData();

    const options = {
      rootMargin: "0px",
      threshold: 1.0,
    };

    const callback = (entries: any) => {
      if (entries[0].isIntersecting) {
        this.loadMoreData();
      }
    };

    const observer = new IntersectionObserver(callback, options);

    observer.observe(this.$refs.observer as Element);
  },
};
</script>

<style>
.main-wrapper {
  background: #000;
  min-height: 100vh;
}

.container {
  max-width: 1088px;
  padding: 0 24px;
  margin: 0 auto;
}

.header {
  display: flex;
  padding: 24px 0;
}

.header__logo {
  max-width: 200px;
  margin-right: 30px;
}

.header__search .v-field__field {
  background: #fff;
}

.content {
  min-height: 110vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.content__item {
  display: inline-block;
  position: relative;
}

.content__item a {
  position: absolute;
  right: 10px;
  top: 10px;
}

.content__item svg {
  width: 50px;
  height: 50px;
}

.not-found {
  color: #fff;
  display: flex;
  justify-content: center;
}

.observer {
  width: 100%;
  height: 50px;
  background: #fff;
}
</style>
