import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Konfigurasi NProgress
NProgress.configure({
  showSpinner: false, // Hilangkan spinner
  speed: 400, // Kecepatan animasi
  minimum: 0.2, // Progress awal
});

export function startProgress() {
  NProgress.start();
}

export function stopProgress() {
  NProgress.done();
}
