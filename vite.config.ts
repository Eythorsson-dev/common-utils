import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        dts({
            include: ['src'],
            exclude: "**/*.test.ts"
        })
    ],
    build: {
        manifest: true,
        minify: true,
        sourcemap: true,
        reportCompressedSize: true,
        lib: {
            entry: "./src/index.ts",
            formats: ['es'],
            name: "common-utils",
            fileName: (format) => `index.${format}.js`,
        },
    }
})