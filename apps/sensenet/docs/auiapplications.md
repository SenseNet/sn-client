# Admin UI Applications

`AUIApplication` is a lightweight extension point for the sensenet Admin UI. It lets repository editors create a folder-like content that contains custom HTML. When the Admin UI opens this content, it renders the HTML in place of the regular child grid.

This is useful for small internal admin tools, dashboards, data fix-up screens, reports, and workflow helpers that should live in the repository instead of being compiled into the Admin UI bundle.

## Content Type

The content type definition is available here:

```text
apps/sensenet/content-types/AUIApplication.xml
```

It derives from `Folder` and adds one editable field:

```xml
<Field name="Html" type="LongText">
  <DisplayName>HTML</DisplayName>
  <Configuration>
    <TextType>LongText</TextType>
    <ControlHint>sn:HtmlEditor</ControlHint>
    <VisibleBrowse>Show</VisibleBrowse>
    <VisibleEdit>Show</VisibleEdit>
    <VisibleNew>Show</VisibleNew>
  </Configuration>
</Field>
```

After the CTD exists in the repository, create a new `AUIApplication` content anywhere under `/Root/Content`, then put the application markup into its `Html` field.

## Rendering Model

When the current content has type `AUIApplication`, `Explore` renders `AUIApplicationView` instead of the grid.

The custom HTML is loaded from the `Html` field and rendered in an iframe. The iframe receives:

```js
window.sensenetAdminApp
```

This object is injected by the Admin UI before your HTML runs.

## Bridge Concept

The HTML app runs inside an iframe. Calling the repository directly from that iframe can hit CORS or authentication problems, and exposing the bearer token directly to arbitrary HTML would be a bad extension pattern.

Instead, the Admin UI provides a small bridge:

1. Your HTML calls `window.sensenetAdminApp.fetch(...)`.
2. The iframe sends a `postMessage` request to the parent Admin UI.
3. The parent Admin UI validates that the request targets the current repository.
4. The parent calls `repository.fetch(...)`.
5. The normal Admin UI auth header/token is attached by the repository client.
6. The response body is sent back to the iframe.

So custom apps can use authenticated repository APIs without reading or storing the token themselves.

## Available API

```ts
window.sensenetAdminApp = {
  repositoryUrl: string
  adminUiUrl: string
  content: {
    Id?: number
    Path?: string
    Name?: string
    DisplayName?: string
    Type?: string
  }
  fetch(input: string, init?: {
    method?: string
    headers?: Record<string, string>
    body?: string
  }): Promise<BridgeResponse>
}
```

The `fetch` function intentionally supports a small subset of the browser `fetch` API:

```ts
type BridgeResponse = {
  ok: boolean
  status: number
  statusText: string
  url: string
  headers: {
    get(name: string): string | null
    entries(): Array<[string, string]>
  }
  text(): Promise<string>
  json(): Promise<any>
}
```

Requests are restricted to the current repository origin. Cross-repository and arbitrary external requests are rejected by the parent Admin UI.

## URL Rules

Use repository-relative URLs when possible:

```js
await window.sensenetAdminApp.fetch('/odata.svc/Root/Content')
```

Absolute URLs are also accepted if they point to the same repository origin:

```js
await window.sensenetAdminApp.fetch('https://example.test.sensenet.com/odata.svc/Root/Content')
```

Use `adminUiUrl` when you need to navigate back to Admin UI routes. Do not use root-relative links for Admin UI navigation inside an `AUIApplication`, because the injected `<base>` tag points relative asset URLs to the repository content path.

```js
const adminPath = (path) => path.replace(/^\/Root(?=\/|$)/, '') || '/'
const adminUiUrl = window.sensenetAdminApp.adminUiUrl || new URL(document.referrer).origin
const query = new URLSearchParams({
  path: adminPath('/Root/Content/test/BannerImages'),
  content: adminPath('/Root/Content/test/BannerImages/example.png'),
})

const editUrl = `${adminUiUrl}/content/explorer/edit?${query.toString()}`
```

For assets such as CSS or JavaScript, the Admin UI injects a `<base>` tag that points to the current `AUIApplication` content path. This means relative references can point to files stored under the application folder:

```html
<link rel="stylesheet" href="styles.css" />
<script src="app.js"></script>
```

## Read Children

```js
const app = window.sensenetAdminApp

async function loadChildren(path) {
  const url =
    `/odata.svc${path}` +
    '?$select=Id,Path,Name,DisplayName,Type,IsFolder,IsFile,CreationDate,ModificationDate' +
    '&$orderby=Name'

  const response = await app.fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  const result = await response.json()

  return result.d.results
}

const items = await loadChildren('/Root/Content/test/BannerImages')
console.log(items)
```

## Read One Content

```js
async function loadContent(path) {
  const response = await window.sensenetAdminApp.fetch(
    `/odata.svc${path}?$select=Id,Path,Name,DisplayName,Type,Description`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  const result = await response.json()

  return result.d
}
```

## Update Content

Use `PATCH` for partial updates. Always send a JSON string body and set `Content-Type`.

```js
async function updateDisplayName(path, displayName) {
  const response = await window.sensenetAdminApp.fetch(`/odata.svc${path}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      DisplayName: displayName,
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Update failed: ${response.status} ${response.statusText} ${details}`)
  }

  return response.json()
}

await updateDisplayName('/Root/Content/test/BannerImages/example.png', 'New display name')
```

## Create Content

Use `POST` on the parent path and include `__ContentType`.

```js
async function createFolder(parentPath, name, displayName) {
  const response = await window.sensenetAdminApp.fetch(`/odata.svc${parentPath}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      __ContentType: 'Folder',
      Name: name,
      DisplayName: displayName,
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Create failed: ${response.status} ${response.statusText} ${details}`)
  }

  return response.json()
}

await createFolder('/Root/Content/test', 'NewBannerFolder', 'New banner folder')
```

## Small Helper Wrapper

For real applications, define a tiny repository helper in your HTML or external JavaScript file:

```js
const sn = {
  request: async (url, init = {}) => {
    const response = await window.sensenetAdminApp.fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers || {}),
      },
    })

    if (!response.ok) {
      const details = await response.text()
      throw new Error(`${response.status} ${response.statusText}: ${details}`)
    }

    return response.json()
  },

  loadChildren: async (path) => {
    const result = await sn.request(`/odata.svc${path}?$select=Id,Path,Name,DisplayName,Type&$orderby=Name`)
    return result.d.results
  },

  patch: async (path, content) => {
    const result = await sn.request(`/odata.svc${path}`, {
      method: 'PATCH',
      body: JSON.stringify(content),
    })
    return result.d
  },
}
```

## Example Application

The first example application is here:

```text
apps/sensenet/examples/auiapplication-banner-images.html
```

It lists the children of:

```text
/Root/Content/test/BannerImages
```

The table displays `Name` and `Type`, and each row has an Edit button that navigates back to the normal Admin UI edit view.

## Recommended Structure

For small tools, putting everything into the `Html` field is fine:

```html
<main>...</main>
<style>
  ...;
</style>
<script>
  ...
</script>
```

For larger tools, store assets under the `AUIApplication` folder:

```text
MyAdminTool
  index HTML in the Html field
  app.js
  styles.css
```

Then reference them with relative URLs:

```html
<link rel="stylesheet" href="styles.css" />
<script src="app.js"></script>
```

## Security Notes

`AUIApplication` is a powerful extension point. Treat it as trusted admin-defined code.

Important guardrails:

- The bridge does not expose the bearer token to the iframe.
- Bridge requests are restricted to the current repository origin.
- The iframe is sandboxed and does not get direct parent DOM access.
- User-clicked links may navigate the top-level Admin UI window, which is needed for Edit links and similar Admin UI routes.
- Users who can edit an `AUIApplication` can run JavaScript inside the Admin UI page, so editing rights should be limited to trusted administrators.
- Do not paste third-party scripts into an `AUIApplication` unless they are reviewed and trusted.

## Limitations

- `sensenetAdminApp.fetch` is not a full browser `fetch` replacement.
- Request bodies must currently be strings. Use `JSON.stringify(...)` for JSON payloads.
- The response object supports `ok`, `status`, `statusText`, `url`, `headers.get`, `headers.entries`, `text()`, and `json()`.
- File upload and streaming APIs are not exposed through this bridge yet.
- High-level repository methods such as `load`, `patch`, or `post` are not exposed directly. Build tiny wrappers around `fetch` in your app.
