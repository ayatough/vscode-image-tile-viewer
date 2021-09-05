import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const vscode = typeof acquireVsCodeApi === "undefined" ? undefined : acquireVsCodeApi();
const ui_debug_mode = vscode === undefined;
console.log((ui_debug_mode ? "Ui debug " : "VSCode extension ") + "mode.");

const makeDebugImageFiles = function (debug) {
  let imgs = [];
  const num_images = debug.numShowingImages;
  for (let i = 0; i < num_images; i++) {
    const name = debug.images[Math.floor(Math.random() * debug.images.length)];
    imgs.push({
      id: i,
      src: name,
      name: name,
    });
  }
  return imgs;
};

export default new Vuex.Store({
  state: {
    vscode: vscode,
    imageFiles: [],
    imageGridNumCols: 2,
    imageWidth: 150,
    imageHeight: 150,
    imageGridGap: 30,
    imageFitStyle: "cover",
    queryString: "",
    displayImageLabel: false,
    debug: {
      mode: ui_debug_mode,
      numShowingImages: 100,
      images: [
        "./imgs/R0020237.JPG",
        "./imgs/R0020241.JPG",
        "./imgs/R0020243.JPG",
        "./imgs/R0020249.JPG",
        "./imgs/R0020325.JPG",
        "./imgs/R0020333.JPG",
        "./imgs/R0020405.JPG",
        "./imgs/R0020418.JPG",
      ]
    },
  },
  getters: {
    imageFiles: state => state.debug.mode ? makeDebugImageFiles(state.debug) : state.imageFiles,
    imageGridNumCols: state => state.imageGridNumCols,
    imageWidth: state => state.imageWidth,
    imageHeight: state => state.imageHeight,
    imageGridGap: state => state.imageGridGap,
    imageFitStyle: state => state.imageFitStyle,
    queryString: state => state.queryString,
    displayImageLabel: state => state.displayImageLabel,
  },
  mutations: {
    updateImageFiles (state, value) {
      state.imageFiles = value;
    },
    updateImageGridNumCols (state, value) {
      state.imageGridNumCols = value;
    },
    updateImageWidth (state, value) {
      state.imageWidth = value;
    },
    updateImageHeight (state, value) {
      state.imageHeight = value;
    },
    updateImageGridGap (state, value) {
      state.imageGridGap = value;
    },
    updateImageFitStyle (state, value) {
      state.imageFitStyle = value;
    },
    updateQueryString (state, value) {
      state.queryString = value;
    },
    updateDisplayImageLabel (state, value) {
      state.displayImageLabel = value;
    },
  }
});
