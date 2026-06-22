import { CapacitorConfig } from "@capacitor/cli";

const isProd = process.env.NODE_ENV === "production";

const config: CapacitorConfig = {
  appId: "de.guenlab.wortwende",
  appName: "Wortwende",
  webDir: "public",
  server: {
    url: isProd
      ? "https://wortwende.guenlab.de"
      : "http://192.168.178.91:3035",
    cleartext: !isProd,
    androidScheme: "https",
    iosScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0D2B45",
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_launcher",
      iconColor: "#FF6B4A",
    },
  },
  android: {
    allowMixedContent: true,
  },
  ios: {
    contentInset: "always",
  },
};

export default config;
