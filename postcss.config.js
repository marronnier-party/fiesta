module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: {},
    "postcss-nesting": {},
    "postcss-preset-env": {},
    cssnano: {},
    // ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})

  },
};
