export const colors = {
  primary: "#DC1E1E",
  neutral: {
    900: "#000000",
    800: "#1F1F1F",
    700: "#2D2D2D",
    600: "#3D3D3D",
    500: "#6B7280",
    400: "#9CA3AF",
    300: "#D1D5DB",
    200: "#E5E7EB",
    100: "#F3F4F6",
    50: "#F9FAFB",
  },
  achievement: {
    gold: "#FFD700",
    goldDark: "#B8860B", // Darker shade for hover/pressed states
  },
} as const;

export type Colors = typeof colors;
