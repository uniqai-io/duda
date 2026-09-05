import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        profile: resolve(import.meta.dirname, "profile.html"),
        contact: resolve(import.meta.dirname, "contact.html"),
        "404": resolve(import.meta.dirname, "404.html"),

        work: resolve(import.meta.dirname, "work/index.html"),

        kerastase: resolve(
          import.meta.dirname,
          "work/kerastase/index.html"
        ),

        loreal: resolve(
          import.meta.dirname,
          "work/loreal/index.html"
        ),

        havaianas: resolve(
          import.meta.dirname,
          "work/havaianas/index.html"
        ),

        fendi: resolve(
          import.meta.dirname,
          "work/fendi/index.html"
        ),

        "paco-rabanne": resolve(
          import.meta.dirname,
          "work/paco-rabanne/index.html"
        ),

        ysl: resolve(
          import.meta.dirname,
          "work/ysl/index.html"
        )
      },

      output: {
        entryFileNames: "assets/js/[name].js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});