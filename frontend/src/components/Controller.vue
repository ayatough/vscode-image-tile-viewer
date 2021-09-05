<template>
  <div id="controller">
    <div id="grid-col-controller">
      <b-icon icon="grid"></b-icon>
      <input type="range" v-model="numCols" min="1" max="30" step="1" />
      <span class="label"> {{ numCols | spacePadding(2) }} </span>
    </div>
    <div id="image-size-controller">
      <div>
        <b-iconstack>
          <b-icon stacked icon="arrow-left"></b-icon>
          <b-icon stacked icon="arrow-right"></b-icon>
        </b-iconstack>
        <b-form-input
          type="range"
          v-model="imageWidth"
          min="50"
          max="640"
          step="10"
        ></b-form-input>
        <span class="label"> {{ imageWidth | spacePadding(4) }} </span>
      </div>
      <div>
        <b-iconstack>
          <b-icon stacked icon="arrow-up"></b-icon>
          <b-icon stacked icon="arrow-down"></b-icon>
        </b-iconstack>
        <b-form-input
          type="range"
          v-model="imageHeight"
          min="50"
          max="640"
          step="10"
        ></b-form-input>
        <span class="label"> {{ imageHeight | spacePadding(4) }} </span>
      </div>
    </div>
    <div id="image-filter-controller">
      <b-form-input
        type="search"
        v-model="queryString"
        placeholder="filter regexp"
        :state="isQueryValid"
      ></b-form-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    numCols: {
      get() {
        return this.$store.getters.imageGridNumCols;
      },
      set(value) {
        this.$store.commit("updateImageGridNumCols", value);
      },
    },
    imageWidth: {
      get() {
        return this.$store.getters.imageWidth;
      },
      set(value) {
        this.$store.commit("updateImageWidth", value);
      },
    },
    imageHeight: {
      get() {
        return this.$store.getters.imageHeight;
      },
      set(value) {
        this.$store.commit("updateImageHeight", value);
      },
    },
    queryString: {
      get() {
        return this.$store.getters.queryString;
      },
      set(value) {
        this.$store.commit("updateQueryString", value);
      },
    },
    isQueryValid: function () {
      try {
        const reg = new RegExp(this.queryString);
      } catch {
        return false;
      }
      return null;
    },
  },
  filters: {
    spacePadding: function (value, space) {
      if (!value) return "";
      value = value.toString();
      return ("\u00A0\u00A0\u00A0\u00A0" + value).slice(-space);
    },
  },
};
</script>

<style scoped>
#controller {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-content: stretch;
  justify-items: center;
  gap: 50px;
  padding: 0px 50px;

  /* debug */
  /* background-color: #ccffcc; */
}

#grid-col-controller,
#image-filter-controller {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
}

#controller > div > * {
  margin: 3px;
}

#image-size-controller {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  justify-content: stretch;
  width: 100%;
}

#image-size-controller > div {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
}

b-icon {
  color: white;
  background-color: white;
}

#num-cols-label {
  text-align: center;
}
</style>

<style>
.label {
  font-family: "Courier New", Courier, monospace;
  font-weight: 700;
  font-size: large;
  margin: 0px;
}
</style>
