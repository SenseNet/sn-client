module.exports = {
  siteMetadata: {
    title: 'sensenet blog',
    description: 'A blog app with gatsby and typescript',
    keywords: 'gatsby, javascript, sensenet, typescript',
    siteUrl: 'https://github.com/SenseNet/sn-client.com',
    author: {
      name: 'Sense/Net',
      url: 'http://sensenet.com/',
      email: 'snteam@sensenet.com',
    },
  },
  plugins: [
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem',
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        mediaTypes: [`text/markdown`, `text/x-markdown`],
      },
    },
    'gatsby-transformer-json',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-material-ui',
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-sensenet`,
      options: {
        host: 'https://netcore-service.test.sensenet.com',
        path: '/Root/Content/SampleWorkspace/Blog',
        accessToken: '',
      },
    },
  ],
}
