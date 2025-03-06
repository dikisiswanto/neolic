import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/((?!api|login).*)', // Proteksi semua halaman kecuali /login & /api
    '/api/data/:path*', // Proteksi API data supaya butuh login
  ],
};
