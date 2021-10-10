<template>
  <div id="page" class="grid">
    <Nav></Nav>
    <Controller></Controller>
    <Main></Main>
  </div>
</template>

<script>
import Nav from "./Nav.vue";
import Main from "./Main.vue";
import Controller from "./Controller.vue";

export default {
  components: {
    Nav,
    Main,
    Controller,
  },
  computed: {
    imageFiles: {
      set(value) {
        this.$store.commit("updateImageFiles", value);
      },
      get() {
        return this.$store.getters.imageFiles;
      },
    },
  },
  created: function () {
    window.addEventListener("message", (event) => {
      const message = event.data;

      switch (message.command) {
        case "sendResources":
          let imgs = [];
          console.log("recieve Message!");
          for (let i = 0; i < message.data.length; i++) {
            imgs.push({
              src: message.data[i].resource_path,
              name: message.data[i].relative_path,
              id: i,
            });
            // console.log(message.data[i]);
          }
          this.imageFiles = imgs;
          break;
      }
    });
  },
};
</script>

<style scoped>
div#page {
  max-height: 100vh;
  height: 100vh;
}
div.grid {
  display: grid;
}
div#page {
  grid-template-rows: 56px 84px 1fr;
}
</style>

<style>
html {
  width: 100vw;
  height: 100vh;
}
body {
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 0px;
}

* {
  background-color: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
  /* border: 1px solid red; */
}

.clickable {
  cursor: pointer;
}

::-webkit-scrollbar {
  padding: 0px;
  width: 10px;
  height: 10px;
  z-index: 100;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /* box-shadow: inset 0 0 0 2px aqua; */
  /* box-shadow: inset 0 0 0 2px var(--vscode-editor-background); */
  background-color: rgba(0, 0, 0, 0.6);
}

::-webkit-scrollbar-corner {
  background: transparent;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  cursor: pointer;
  width: 14px;
  height: 14px;
  background-color: var(--vscode-editor-foreground);
  margin-top: -6px;
  border-radius: 50%;

  /* background-color: blueviolet; */
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 2px;
  background-color: var(--vscode-editor-foreground);
  width: 10px;

  /* background-color: gray; */
}

input[type="range"]:focus {
  outline: none;
}

input[type="search"] {
  -webkit-appearance: none;
  color: var(--vscode-input-foreground);
  background-color: var(--vscode-input-background);
  border: 0px;
  border-bottom: 1px solid var(--vscode-input-border);
  width: 100%;
  font-size: medium;
}

input[type="search"]:focus {
  outline: none;
  color: var(--vscode-input-foreground);
  background-color: var(--vscode-input-background);
}
</style>
