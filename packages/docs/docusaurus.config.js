// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/nightOwlLight');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'react-native-mlkit',
  tagline: 'Run TFLite Models on device for fast, low-cost inference',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'infinitered', // Usually your GitHub org/user name.
  projectName: 'react-native-mlkit', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath:"/",
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
            customCss: require.resolve('./src/css/custom.css'),
        }
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'react-native-mlkit',
        logo: {
          alt: 'react-native-mlkit Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          {to: '/', label: 'Home', position: 'left'},
            {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },

          {
            type: 'docSidebar',
            sidebarId: 'contribute',
            position: 'left',
            label: 'Contribute',
          },
          {
            type: 'docSidebar',
            sidebarId: 'tutorials',
            position: 'left',
            label: 'Tutorials',
          },
          {
            href: 'https://github.com/infinitered/react-native-mlkit',
            label: 'GitHub',
            position: 'right',
          },
        ],
        style: 'dark'
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/react-native-mlkit',
              },
              {
                label: 'Slack Community',
                href: 'https://community.infinite.red',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/infinitered',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Infinite Red Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;


