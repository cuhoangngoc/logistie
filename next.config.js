/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@mui/icons-material',
    '@mui/x-date-pickers',
    'rrule',
    '@devexpress/dx-react-core',
    '@devexpress/dx-scheduler-core',
    '@devexpress/dx-react-scheduler-material-ui',
    '@devexpress/dx-react-scheduler',
    '@devexpress/dx-react-grid-material-ui',
  ],
};

module.exports = nextConfig;
