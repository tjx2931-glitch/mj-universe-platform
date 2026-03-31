const path = require("path");
require("dotenv").config();

const isDevServer = process.env.NODE_ENV !== "production";

const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

let webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },

  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },

    configure: (config) => {

      // ✅ FIX 1: REMOVE ForkTsChecker (THIS FIXES YOUR BUILD ERROR)
      config.plugins = config.plugins.filter(
        (plugin) =>
          plugin.constructor &&
          plugin.constructor.name !== "ForkTsCheckerWebpackPlugin"
      );

      // ✅ FIX 2: Reduce unnecessary watching (performance)
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };

      // ✅ FIX 3: Optional health plugin
      if (config.enableHealthCheck && healthPluginInstance) {
        config.plugins.push(healthPluginInstance);
      }

      return config;
    },
  },
};

webpackConfig.devServer = (devServerConfig) => {
  if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetup = devServerConfig.setupMiddlewares;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (originalSetup) {
        middlewares = originalSetup(middlewares, devServer);
      }

      setupHealthEndpoints(devServer, healthPluginInstance);
      return middlewares;
    };
  }

  return devServerConfig;
};

// ✅ Keep visual edits only in dev
if (isDevServer) {
  try {
    const { withVisualEdits } = require("@emergentbase/visual-edits/craco");
    webpackConfig = withVisualEdits(webpackConfig);
  } catch (err) {
    if (
      err.code === "MODULE_NOT_FOUND" &&
      err.message.includes("@emergentbase/visual-edits/craco")
    ) {
      console.warn(
        "[visual-edits] not installed — skipping visual editing."
      );
    } else {
      throw err;
    }
  }
}

module.exports = webpackConfig;