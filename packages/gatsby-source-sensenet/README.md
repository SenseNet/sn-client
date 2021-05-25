# gatsby-source-sensenet

Source plugin for pulling data from [sensenet](https://sensenet.com) into Gatsby websites.

sensenet is an open-source headless content management system (CMS) built mainly for developers and development companies.
It is a content repository where you can store all your content and reach it through APIs. It is a solid base for your custom solutions, offering an enterprise-grade security and permission system, versioning, dynamic content types and even more.

An example site for using this plugin is at [sn-blog-gatsby](https://github.com/SenseNet/sn-client/tree/develop/examples/sn-blog-gatsby)

## How to install

```shell
npm install gatsby-source-sensenet
```

## Available options

You need a way to pass environment variables to the build process, so secrets and other secured data should not commit to source control.

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-sensenet`,
      options: {
        host: '<YOUR REPOSITORY URL>',
        path: '<RELATIVE PATH TO YOUR CONTENTS>',
        oDataOptions: '<ODATA OPTIONS>'
        accessToken: '<ACCESS TOKEN FOR AUTHENTICATION>'
      },
    },
  ],
}
```

**`host`** [string][required]

The url of your repository, e.g.: 'https://dev.demo.sensenet.com'

**`path`** [string][optional] [default: '/Root/Content']

This is the root path of the container where your stuff are located in your repository.
The default value is 'Root/Content' but if you don't want to load all the content from your repository you can reduce the number of content request by specifying the container (e.g.: folder) that contains all the contents you will need to create a site.

**`oDataOptions`** [[ODataParams](https://github.com/SenseNet/sn-client/blob/28bcd4f0cbf8f366ba8afa33f839c26959c78c4e/packages/sn-client-core/src/Models/ODataParams.ts#L31)][optional] [default:

```json
{
  "enableautofilters": false,
  "enablelifespanfilter": false,
  "inlinecount": "allpages",
  "metadata": "no",
  "select": ["DisplayName", "Description", "Icon"],
  "top": 10000
}
```

]

Query options are query string parameters a client may specify to control the amount and order of the data that a service returns for the resource identified by the URI. In sensenet there're two types of query options available OData System Query Options and custom sensenet query options. The OData standard query options' names are prefixed with a "$" character, sensenet query options should be used without a prefix.

| option                                                                                                 |                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [$select](https://docs.sensenet.com/api-docs/basic-concepts/03-select-expand#select)                   | specifies that a response from the service should return a subset of properties                                                                                                      |
| [$expand](https://docs.sensenet.com/api-docs/basic-concepts/03-select-expand#expand)                   | allows you to identify related entries with a single URI such that a graph of entries could be retrieved with a single HTTP request (e.g. creator user or any other related content) |
| [$orderby](https://docs.sensenet.com/api-docs/basic-concepts/04-ordering-paging#ordering)              | allows you to sort results by one or more properties, forward or reverse direction                                                                                                   |
| [$top](https://docs.sensenet.com/api-docs/basic-concepts/04-ordering-paging#top)                       | identifies a subset selecting only the first N items of the set                                                                                                                      |
| [$skip](https://docs.sensenet.com/api-docs/basic-concepts/04-ordering-paging#skip)                     | identifies a subset that is defined by seeking N entries into the collection and selecting only the remaining ones                                                                   |
| [$filter](https://docs.sensenet.com/api-docs/basic-concepts/05-search-filter#filtering)                | identifies a subset determined by selecting only the entries that satisfy the predicate expression specified by the query option                                                     |
| $format                                                                                                | specifies that a response to the request MUST use the media type specified by the query option (Atom and xml formats are not implemented yet in sensenet)                            |
| [$inlinecount](https://docs.sensenet.com/api-docs/basic-concepts/02-collection#inlinecountqueryoption) | controls the `__count` property that can be found in every collection response                                                                                                       |
| [query](https://docs.sensenet.com/api-docs/basic-concepts/05-search-filter#queryoption)                | filter the result collection using sensenet Content Query                                                                                                                            |
| [metadata](https://docs.sensenet.com/api-docs/basic-concepts/06-metadata)                              | controls the metadata content in output entities                                                                                                                                     |

**`accessToken`** [string | Function][required]

accessToken can be a string or a function as well, it is for authentication purposes.
If you would like to generate accesstoken programatically you can use _codeLogin_ function from [sn-authentication-oidc-react](https://github.com/SenseNet/sn-client/tree/develop/packages/sn-authentication-oidc-react) package.

```shell
npm install @sensenet/authentication-oidc-react
```

Example:

```javascript
// In your gatsby-config.js
const fetch = require('node-fetch')
const { codeLogin } = require('@sensenet/authentication-oidc-react')
const { configuration } = require('./configuration')

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-sensenet`,
      options: {
        host: '<YOUR REPOSITORY URL>',
        path: '<RELATIVE PATH TO YOUR CONTENTS>',
        oDataOptions: '<ODATA OPTIONS>'
        accessToken: async () => {
  const authData = await codeLogin({ ...configuration, fetchMethod: fetch })
  return authData.access_token
}
      },
    },
  ],
}

```

You can overwrite fetch method according to your own needs. In this example [node-fetch](https://www.npmjs.com/package/node-fetch) is used, you have to install it before using it:

```shell
npm install node-fetch
```

Configuration should be something like this:

```javascript
// Create a new file in root folder with the name of configuration.js
exports.repositoryUrl = '<YOUR REPOSITORY URL>'

exports.configuration = {
  clientId: process.env.GATSBY_REACT_APP_CLIENT_ID || '',
  clientSecret: process.env.GATSBY_REACT_APP_CLIENT_SECRET || '',
  identityServerUrl: '<YOUR IDENTITY SERVER URL>',
}
```

**GATSBY_REACT_APP_CLIENT_ID** and **GATSBY_REACT_APP_CLIENT_SECRET** environmental variables should be defined.

You can easily store it in .env files by doing the following:

```javascript
// In your .env file
GATSBY_REACT_APP_CLIENT_ID=<YOUR CLIENT ID>
GATSBY_REACT_APP_CLIENT_SECRET=<YOUR SECRET>

```

### Where can you get the missing information?

There are two ways to get your client_id and client_secret:
From your [profile site](https://docs.sensenet.com/concepts/basics/06-authentication-secrets) and from [admin-ui](https://docs.sensenet.com/guides/settings/api-and-security) as well. Here you can check your repository url and identity server url, too.

## When do I use this plugin?

sensenet is the single hub for all your content packed with enterprise grade features. In sensenet everything is a content (blog posts, files, users, roles, comments, etc.) delivered the same way through the API, making it super easy to work with any type of data. With sensenet's and Gatsby's flexibility and power you can build any kind of app or website you need.
For more details check [this site](https://docs.sensenet.com/integrations//gatsby/using-gatsby-with-sensenet).

## Examples of usage

```javascript
// In your gatsby-config.js
const fetch = require('node-fetch')
const { codeLogin } = require('@sensenet/authentication-oidc-react')
const { configuration } = require('./configuration')

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-sensenet`,
      options: {
        host: 'https://dev.demo.sensenet.com',
        path: '/Root/Content/SampleWorkspace/Blog',
        oDataOptions: {
          select: 'all',
          expand: ['LeadImage'],
          metadata: 'no',
        },
        accessToken: async () => {
          const authData = await codeLogin({ ...configuration, fetchMethod: fetch })
          return authData.access_token
        },
      },
    },
  ],
}
```

## How to query for data

gatsby-source-sensenet creates gatsby node from all the contents that return from the query. The _internal.type_ of all nodes consists of the "sensenet" prefix and the original type of the content.
If you have a "BlogPost" type then all the content created from this type will be a gatsby node whose _internal.type_ will be: "sensenetBlogPost".

You might query for all of a type of node e.g.: sensenetBlogPost:

```graphql
  query MyQuery {
    allSensenetBlogPost {
      edges {
        node {
          Name
          DisplayName
        }
      }
    }
```

To query for a single blogpost with the name '2021-02-23-how-we-post':

```graphql
query MyQuery {
  sensenetBlogPost(Name: { eq: "2021-02-23-how-we-post" }) {
    DisplayName
    Name
  }
}
```

gatsby-source-sensenet also build a tree from the contents. The root is always "sensenetroot" what is the _path_ you pass in your gatsby-config or the default path is _/Root/Content_. If your collection has more types (e.g.: Folder and BlogPost) you can query both of them of course, and if you would like to go deeper (select the Folder's children which contains Images ) you can nest childrenSensenet[_Type_] into another childrenSensenet[_Type_].

```graphql
query MyQuery {
  sensenetroot {
    childrenSensenetBlogPost {
      Name
      DisplayName
    }
    childrenSensenetFolder {
      Name
      DisplayName
      childrenSensenetImage {
        Name
        DisplayName
      }
    }
  }
}
```

### Create pages

When building pages from contents you may want to create URL for your blogpost contents. E.g. if you have a content with markdown body at /Root/Content/SampleWorkspace/Blog/2021-02-23-how-we-post, you might want to turn that into a page on your site at example.com/2021-02-23-how-we-post/.

This is an example how can you implement:

When "sensenetBlogPost" node is created you should create a new field with the name of "slug" on the node:

```javascript
//In your gatsby-node.js
exports.onCreateNode = async ({ node, actions: { createNodeField } }) => {
  if (node.internal.type === 'sensenetBlogPost') {
    createNodeField({
      node,
      name: 'slug',
      value: node.Name || '',
    })
  }
}
```

Then iterate through all sensenetBlogPost and create page with using a template for all.

```javascript
//In your gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const allSensenetBlogPost = await graphql(`
    {
      allSensenetBlogPost(limit: 1000) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  if (allSensenetBlogPost.errors) {
    console.error(allSensenetBlogPost.errors)
    throw new Error(allSensenetBlogPost.errors)
  }

  const blogPostTemplate = path.resolve('<YOUR TEMPLATE>')

  allSensenetBlogPost.data.allSensenetBlogPost.edges.forEach(({ node }) => {
    const { slug } = node.fields

    createPage({
      path: `/${slug}/`,
      component: blogPostTemplate,
      context: {
        slug,
      },
    })
  })
}
```

## Complex types

### Image

In sensenet images can be references. In this case the LeadImage field of a Blogpost will be something like this:

```json
"LeadImage": {
  "__deferred": {
    "uri": "/odata.svc/Root/Content/SampleWorkspace/Blog('2021-01-13-docviewer-updates')/LeadImage"
  }
},
```

Reference fields have to be expanded. You can define the fields you would like expand in the gatsby-config by listing the fieldNames in an array, eg.:
`oDataOptions: {expand: ['LeadImage']},`

Then you can create a remote file node from it:

```javascript
exports.onCreateNode = async ({ node, actions: { createNode }, createNodeId, getCache }) => {
  if (node.internal.type === 'sensenetBlogPost') {
    const leadImageNode = await createRemoteFileNode({
      url: `<YOUR REPOSITORY URL>${node.LeadImage.Path}`,
      parentNodeId: node.Id.toString(),
      createNode,
      createNodeId,
      getCache,
    })
    if (leadImageNode) {
      node.leadImage___NODE = leadImageNode.id ///connect to blogpost node
    }
  }
}
```

<note severity="info">The content should be public otherwise you have to provide a httpHeaders: { Authorization: `Bearer <yourAccessToken>` } attribute to createRemoteFileNode function</note>

You can query for leadImage field on all blogpost:

```graphql
query MyQuery {
  allSensenetBlogPost {
    edges {
      node {
        leadImage {
          childImageSharp {
            gatsbyImageData(layout: FIXED)
          }
        }
      }
    }
  }
}
```

You can use [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) for rendering these images.

### Mdx

If your content contains a filed with mdx format you can process it using [gatsby-plugin-mdx](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/).
First, you need to create node from the mardkdown and save it with the `internal.mediaType ='text/markdown'` .

```javascript
//In your gatsby-node.js
exports.onCreateNode = async ({ node, actions: { createNode } }) => {
  if (node.internal.type === 'sensenetBlogPost') {
    const bodyMdxNode = {
      id: `${node.Id.toString()}-MarkdownBody`,
      parent: node.Id.toString(),
      internal: {
        type: `${node.internal.type}MarkdownBody`,
        mediaType: 'text/markdown',
        content: node.Body,
        contentDigest: node.Body,
      },
    }

    createNode(bodyMdxNode)

    if (bodyMdxNode) {
      node.markdownBody___NODE = bodyMdxNode.id //connect to blogpost node
    }
  }
}
```

This node is connected to the blogpost, so you can query it like this:

```graphql
query MyQuery {
  allSensenetBlogPost {
    edges {
      node {
        markdownBody {
          childMdx {
            body
          }
        }
      }
    }
  }
}
```

To render the markdown use `<MDXRenderer><YOUR MARKDOWN BODY></MDXRenderer>`

## How to contribute

Before you start working on this package please check the [contibution guide](https://github.com/SenseNet/sn-client/blob/develop/CONTRIBUTING.md) first.
