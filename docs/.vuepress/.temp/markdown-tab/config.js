import { CodeTabs } from "C:/Users/yangl/Desktop/tx7do.github.io/node_modules/.pnpm/@vuepress+plugin-markdown-t_b37785c94796fc53cafb8c404306f897/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "C:/Users/yangl/Desktop/tx7do.github.io/node_modules/.pnpm/@vuepress+plugin-markdown-t_b37785c94796fc53cafb8c404306f897/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "C:/Users/yangl/Desktop/tx7do.github.io/node_modules/.pnpm/@vuepress+plugin-markdown-t_b37785c94796fc53cafb8c404306f897/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
