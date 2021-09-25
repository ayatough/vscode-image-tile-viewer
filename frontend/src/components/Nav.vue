<template>
  <div id="nav" class="justify-content-between">
    <div role="button" id="a">
      <b-icon-list
        font-scale="2"
        v-b-toggle.sidebar
        class="disable-focus"
      ></b-icon-list>
    </div>
    <b-sidebar id="sidebar" title="" shadow no-header backdrop>
      <div class="px-3 py-2">
        <p class="label">grid gap:</p>
        <b-form-input
          type="range"
          v-model="imageGridGap"
          min="0"
          max="100"
          step="5"
        ></b-form-input>
        <hr />
        <p class="label">display style:</p>
        <b-form-select
          v-model="imageFitStyle"
          :options="imageFitStyleOptions"
        ></b-form-select>
        <hr />
        <p class="label">Show name:</p>
        <b-form-checkbox
          id="checkbox"
          v-model="displayImageLabel"
          name="display-image-label"
        >
        </b-form-checkbox>
        <hr />
      </div>
    </b-sidebar>

    <!-- <b-link href="https://github.com/ayatough/vscode-image-tile-viewer">
      <b-icon-github
        font-scale="2"
        variant="dark"
        class="disable-focus"
      ></b-icon-github>
    </b-link> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageFitStyleOptions: [
        { value: "cover", text: "cover" },
        { value: "contain", text: "contain" },
        { value: "fill", text: "fill" },
      ],
    };
  },
  computed: {
    imageGridGap: {
      get() {
        return this.$store.getters.imageGridGap;
      },
      set(value) {
        this.$store.commit("updateImageGridGap", value);
      },
    },
    imageFitStyle: {
      get() {
        return this.$store.getters.imageFitStyle;
      },
      set(value) {
        this.$store.commit("updateImageFitStyle", value);
      },
    },
    displayImageLabel: {
      get() {
        return this.$store.getters.displayImageLabel;
      },
      set(value) {
        this.$store.commit("updateDisplayImageLabel", value);
      },
    },
  },
};
</script>

<style scoped>
div#nav {
  display: flex;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--vscode-panel-border);
  box-shadow: 0px 1px 1px var(--vscode-widget-shadow);
}

.disable-focus {
  outline: none;
}

div#sidebar {
  border: 1px solid var(--vscode-dropdown-border);
  display: flex;
}
</style>
