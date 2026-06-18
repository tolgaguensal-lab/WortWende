import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))", hover: "hsl(var(--primary-hover))", muted: "hsl(var(--primary-muted))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))", hover: "hsl(var(--accent-hover))", muted: "hsl(var(--accent-muted))" },
        amber: { DEFAULT: "hsl(var(--amber))", foreground: "hsl(var(--amber-foreground))", muted: "hsl(var(--amber-muted))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))", muted: "hsl(var(--destructive-muted))" },
        success: { DEFAULT: "hsl(var(--success))", muted: "hsl(var(--success-muted))" },
        warning: { DEFAULT: "hsl(var(--warning))", muted: "hsl(var(--warning-muted))" },
        info: { DEFAULT: "hsl(var(--info))", muted: "hsl(var(--info-muted))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))", highlight: "hsl(var(--card-highlight))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        dark: { bg: "hsl(var(--dark-bg))", card: "hsl(var(--dark-card))", "card-elevated": "hsl(var(--dark-card-elevated))", border: "hsl(var(--dark-border))", text: "hsl(var(--dark-text))", muted: "hsl(var(--dark-muted))", input: "hsl(var(--dark-input))" },
      },
      borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)", xl: "var(--radius-xl)", "2xl": "var(--radius-2xl)", full: "var(--radius-full)" },
      fontFamily: { display: ["Nunito", "Nunito Sans", "system-ui", "sans-serif"], body: ["Nunito Sans", "Inter", "system-ui", "sans-serif"] },
      boxShadow: { card: "0 18px 45px rgba(13,43,69,0.08)", "card-hover": "0 24px 55px rgba(13,43,69,0.12)", modal: "0 20px 60px rgba(13,43,69,0.15)" },
      keyframes: { "fade-in": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } }, "scale-in": { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } } },
      animation: { "fade-in": "fade-in 0.5s ease-out", "scale-in": "scale-in 0.3s ease-out" },
    },
  },
  plugins: [],
};
export default config;
