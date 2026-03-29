import { GitContributors } from "C:/Users/yangl/Desktop/tx7do.github.io/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_235b0fef6343426c7e7fbb653ed8f375/node_modules/@vuepress/plugin-git/lib/client/components/GitContributors.js";
import { GitChangelog } from "C:/Users/yangl/Desktop/tx7do.github.io/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_235b0fef6343426c7e7fbb653ed8f375/node_modules/@vuepress/plugin-git/lib/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
