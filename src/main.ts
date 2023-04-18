import { ViteSSG } from "vite-ssg"
import { setupLayouts } from "virtual:generated-layouts"
import Previewer from "virtual:vue-component-preview"
import App from "./App.vue"
import type { UserModule } from "./types"
import generatedRoutes from "~pages"
import "./input.css"
// import "@unocss/reset/tailwind.css"
import "uno.css"
import index from "./pages/index.vue"
import Dashboard from "~/pages/Dashboard.vue"
import Project from "~/pages/Project.vue"
import ToReview from "~/pages/ToReview.vue"

const routes = [
    { path: "/", component: index },
    { path: "/dashboard", component: Dashboard },
    { path: "/toReview", component: ToReview },
    { path: "/dashboard/project/:projectHash", component: Project },
]
// const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(App, { routes, base: import.meta.env.BASE_URL }, (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>("./modules/*.ts", { eager: true })).forEach((i) => i.install?.(ctx))
    ctx.app.use(Previewer)
})
