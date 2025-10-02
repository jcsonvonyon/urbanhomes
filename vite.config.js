import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        signin: './signin.html',
        signup: './signup.html',
        dashboard: './dashboard.html',
        accountType: './account-type.html',
        forgotPassword: './forgot-password.html',
        resetPassword: './reset-password.html',
        profile: './profile.html',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
