export default {
  expo: {
    name: "simple-push-test",
    slug: "simple-push-test",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.sammy23.simplepushtest",
      googleServicesFile: "./google-services.json"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-notifications"
    ],
    extra: {
      eas: {
        projectId: "e804c7ea-be16-43d2-b15e-f0e945e8fe58"
      }
    }
  }
}