# gatsby-source-sensenet

Source plugin for pulling data from [sensenet](https://sensenet.com) into Gatsby websites.

sensenet is an open-source headless content management system (CMS) built mainly for developers and development companies.
It is a content repository where you can store all your content and reach them through APIs. It is a solid base for your custom solutions, offering an enterprise-grade security and permission system, versioning, dynamic content types and even more.

An example of how to use this plugin is at [sn-blog-gatsby](https://github.com/SenseNet/gatsby-starter-sensenet-blog)

## How to install

```shell
npm install gatsby-source-sensenet
```

## Available options

You have to pass environment variables to the build process, so secrets and other secured data will not commited along the source code.

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
        level: '<NUMBER OF LEVELS TO READ CONTENTS>'
      },
    },
  ],
}
```

**`host`** [string][required]

The url of your repository, e.g.: 'https://dev.demo.sensenet.com'

**`path`** [string][optional] [default: '/Root/Content']

This is the root path of the container where your stuff are located in your repository.
The default value is 'Root/Content' but if you don't want to load all the content from your repository you can reduce the number of content request by specifying a container (e.g.: folder, workspace or library) that contains the contents you need to build up your static site.

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

Query options are query string parameters that the client may specify controling the amount and order of the data the service returns. In sensenet there're two types of query options available OData System Query Options and custom sensenet query options. The OData standard query options' names are prefixed with a "$" character, sensenet query options should be used without a prefix.

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

**`level`** [number][optional]

The value of the level option should be a positive whole number (integer) to specify the number of levels from which you want to query content.
If it is not specified, the plugin will read all levels until it finds a child content.

**`accessToken`** [string | Function][required]

accessToken can be a string or a function as well, it is for authentication purposes.
If you would like to generate access token programmatically you can use _codeLogin_ function from [sn-authentication-oidc-react](https://github.com/SenseNet/sn-client/tree/develop/packages/sn-authentication-oidc-react) package.

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

You can overwrite fetch method according to your own needs. In this particular example we are using [node-fetch](https://www.npmjs.com/package/node-fetch), so you have to install it first:

```shell
npm install node-fetch
```

For using environmental variables you should install [dotenv](https://www.npmjs.com/package/node-fetch):

```shell
npm install dotenv
```

Configuration should be something like this:

```javascript
// Create a new file in root folder with the name configuration.js
require('dotenv').config()

exports.repositoryUrl = '<YOUR REPOSITORY URL>'

exports.configuration = {
  clientId: process.env.GATSBY_REACT_APP_CLIENT_ID || '',
  clientSecret: process.env.GATSBY_REACT_APP_CLIENT_SECRET || '',
  identityServerUrl: '<YOUR IDENTITY SERVER URL>',
}
```

**GATSBY_REACT_APP_CLIENT_ID** and **GATSBY_REACT_APP_CLIENT_SECRET** [environmental variables](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/) should be defined.

You can easily store them in .env files by doing the following:

```javascript
// In your .env file
GATSBY_REACT_APP_CLIENT_ID=<YOUR CLIENT ID>
GATSBY_REACT_APP_CLIENT_SECRET=<YOUR SECRET>

```

### Where can you get the missing information?

There are two ways to get your client_id and client_secret:
You can find them on your [snaas user profile](https://docs.sensenet.com/concepts/basics/06-authentication-secrets) or on the [admin-ui](https://docs.sensenet.com/guides/settings/api-and-security) logged-in to the repository as well. Also here can be found the repository url and url of the identity server.

## When do I use this plugin?

sensenet is the single hub for all your content packed with enterprise grade features. In sensenet everything is a content (blog posts, files, users, roles, comments, etc.) delivered the same way through the API, making it super easy to work with any type of data. With the flexibility and power of sensenet and Gatsby you can build any kind of app or website you need.
For more details check [this guide](https://docs.sensenet.com/integrations/gatsby/using-gatsby-with-sensenet).

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

gatsby-source-sensenet creates gatsby nodes from all the contents returned by a query. The _internal.type_ of all nodes consists of the "sensenet" prefix and the original type of the content.
If you have a "BlogPost" content type then all the content created with this type will be presented as gatsby nodes whose _internal.type_ will be: "sensenetBlogPost".

To query for all nodes with a specific type e.g.: sensenetBlogPost:

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

To query for a specific blogpost with the name '2021-02-23-how-we-post':

```graphql
query MyQuery {
  sensenetBlogPost(Name: { eq: "2021-02-23-how-we-post" }) {
    DisplayName
    Name
  }
}
```

gatsby-source-sensenet is also capable to build a tree of content. The root comes from the _path_ param you've passed to your gatsby-config or the default path (_/Root/Content_). If your collection has multiple types (e.g.: Folder and BlogPost) you can query both for them, and if you would like to go deeper in the tree (selecting the Folder's children which contains Images) you can create a nested childrenSensenet[_Type_] into another childrenSensenet[_Type_].

```graphql
query MyQuery {
  sensenetBlog {
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

If you are building pages from contents you may have to create custom URL for your blogpost contents. E.g. if you have a content with the markdown body at /Root/Content/SampleWorkspace/Blog/2021-02-23-how-we-post, you might want to turn that path into example.com/2021-02-23-how-we-post/.

Following example shows you how you can achieve this:

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

Then iterate through all sensenetBlogPost nodes and create a page for all using a template.

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

Images in sensenet could be handled as references. In this case the "LeadImage" field of a Blogpost will be something like this in the response:

```json
"LeadImage": {
  "__deferred": {
    "uri": "/odata.svc/Root/Content/SampleWorkspace/Blog('2021-01-13-docviewer-updates')/LeadImage"
  }
},
```

To have their actual data, reference fields have to be expanded. You can define the fields you would like expand in the gatsby-config by listing the fieldNames in an array, eg.:
`oDataOptions: {expand: ['LeadImage']},`

Then you can create a remote file node from the returned data:

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
      node.leadImage___NODE = leadImageNode.id ///connect to blog post node
    }
  }
}
```

<note severity="info">If you want to request content from a sensenet repository, they should be public otherwise you have to provide a httpHeaders: { Authorization: `Bearer <yourAccessToken>` } attribute to createRemoteFileNode function</note>

You can query for the value of the leadImage field on all blogpost:

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

For rendering these images you can use [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/).

### Mdx

If your content contains a field with value in mdx format you can process it using [gatsby-plugin-mdx](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/).
First, you have to create a node from the mardkdown itself and save it with `internal.mediaType ='text/markdown'` .

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
      node.markdownBody___NODE = bodyMdxNode.id //connect to blog post node
    }
  }
}
```

This node is now connected to the blogpost, so you can query for it this way:

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

### Richtext

RichText is a field type that enables authors to create rich text content. By default sensenet will provide you the field as HTML format but there is also possible to get the response as JSON. For getting both you have to add `richtexteditor: 'all'` to the oDataOptions in gatsby-config. The API response contains a _text_ part (which is the HTML code) and an _editor_ returned as a JSON array of nodes that follows the format of an abstract syntax tree.

```JSON
{
   "type":"doc",
   "content":[
      {
         "type":"paragraph",
         "attrs":{
            "textAlign":"center"
         },
         "content":[
            {
               "type":"text",
               "marks":[
                  {
                     "type":"bold"
                  }
               ],
               "text":"Lorem ipsum dolor sit amet ..."
            }
         ]
      }
   ]
}
```

JSON can be rendered with _renderHtml_ method from @sensenet/editor-react package.

## How to contribute

Before you start working on this package please check the [contribution guide](https://github.com/SenseNet/sn-client/blob/develop/CONTRIBUTING.md) first.
