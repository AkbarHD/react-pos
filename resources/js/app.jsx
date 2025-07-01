import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Mengimpor file CSS Bootstrap 5.3
import 'bootstrap/dist/css/bootstrap.min.css';

// Mengimpor file CSS kustom
import '../css/style.css';

createInertiaApp({
  resolve: name => {
    // ini fungsinya untuk mengimpor komponen halaman secara dinamis
    // berdasarkan nama yang diberikan. Misalnya, jika nama adalah 'Home',
    // maka akan mengimpor komponen dari file 'Pages/Home.jsx'.
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    return pages[`./Pages/${name}.jsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
