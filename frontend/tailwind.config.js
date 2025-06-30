module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#4CAF50",
          "secondary": "#FF9800",
          "accent": "#9C27B0",
          "neutral": "#3D4451",
          "base-100": "#FFFFFF",
          "info": "#2196F3",
          "success": "#4CAF50",
          "warning": "#FFC107",
          "error": "#F44336",
        },
      },
    ],
  },
};