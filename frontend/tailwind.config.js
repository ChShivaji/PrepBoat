/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#F8FAFC",       // Clean light background
        darkCard: "#FFFFFF",     // Clean white cards
        darkBorder: "#E2E8F0",   // Light gray borders
        brandPurple: "#4F46E5",  // Premium Indigo
        brandEmerald: "#10B981", // Success Accent
        brandCoral: "#EF4444",   // Danger Accent
        brandAmber: "#F59E0B",   // Warning/Aptitude Accent
        glassBg: "rgba(255, 255, 255, 0.8)",
        glassBorder: "rgba(226, 232, 240, 0.8)"
      },
      boxShadow: {
        glass: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        brand: "0 4px 12px rgba(79, 70, 229, 0.1)"
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
}
