exports.repositoryUrl = 'https://dev.demo.sensenet.com'

exports.configuration = {
  clientId: process.env.GATSBY_REACT_APP_CLIENT_ID || '', // businesscat clientId for dev.demo.sensenet.com
  clientSecret: process.env.GATSBY_REACT_APP_CLIENT_SECRET || '',
  identityServerUrl: 'https://is.demo.sensenet.com',
}
