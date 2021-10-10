<template>
  <div id="main">
    <div id="image-grid" v-bind:style="gridStyle">
      <div
        v-for="img in imageSelectedFiles"
        :key="img.id"
        class="grid_row"
        v-on:click="openImage(img, $event)"
      >
        <b-img-lazy
          v-bind:src="img.src"
          center
          rounded
          alt="Responsive image"
          width="100px"
          v-bind:style="imageStyle"
          class="image"
        ></b-img-lazy>
        <p class="caption" v-bind:style="imageLabelStyle">{{ img.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num_imgs: 1000,
      imgs: [],
    };
  },
  computed: {
    imageFiles: {
      get() {
        return this.$store.getters.imageFiles;
      },
    },
    numCols: {
      get() {
        return this.$store.getters.imageGridNumCols;
      },
    },
    imageWidth: {
      get() {
        return this.$store.getters.imageWidth;
      },
    },
    imageHeight: {
      get() {
        return this.$store.getters.imageHeight;
      },
    },
    imageGridGap: {
      get() {
        return this.$store.getters.imageGridGap;
      },
    },
    imageFitStyle: {
      get() {
        return this.$store.getters.imageFitStyle;
      },
    },
    displayImageLabel: {
      get() {
        return this.$store.getters.displayImageLabel;
      },
    },
    queryString: {
      get() {
        return this.$store.getters.queryString;
      },
    },
    gridStyle: function () {
      return {
        "grid-template-columns":
          "repeat(" + this.numCols + ", " + this.imageWidth + "px)",
        gap: this.imageGridGap + "px " + this.imageGridGap + "px",
      };
    },
    imageStyle: function () {
      return {
        "object-fit": this.imageFitStyle,
        width: this.imageWidth + "px",
        height: this.imageHeight + "px",
      };
    },
    imageLabelStyle: function () {
      return {
        display: this.displayImageLabel ? "unset" : "none",
      };
    },
    imageSelectedFiles: function () {
      let reg;
      try {
        reg = new RegExp(this.queryString);
        let imgs = [];
        this.imageFiles.forEach((record) => {
          if (record.name.match(reg)) {
            imgs.push(record);
          }
        });
        return imgs;
      } catch {
        return this.imageFiles;
      }
    },
  },
  methods: {
    openImage: function (img, event) {
      if (!this.$store.state.debug.mode) {
        this.$store.state.vscode.postMessage({
          command: "openImage",
          src: img.src,
          newTab: event.shiftKey,
        });
      }
    },
  },
};
</script>

<style scoped>
div#main {
  width: 100%;
  height: 100%;
  overflow: overlay;
  justify-content: center;
}

div#image-grid {
  display: grid;
  /* gap: 30px 90px; */
  grid-template-columns: repeat(5, 300px);
  min-width: 100%;
  width: max-content;
  overflow: visible;
  padding: 60px;
  justify-content: center;
  position: relative;
  top: 0px;
  left: 0px;
  background-color: transparent;
}

.image-item {
  object-fit: cover;
  width: 300px;
  height: 300px;
}

p.caption {
  text-align: center;
}

.image {
  cursor: pointer;
}

.image:hover {
  filter: opacity(0.8);
  transition: filter 0.4s cubic-bezier(0, 2.5, 0.2, 2.5);
}
</style>
