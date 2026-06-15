import { CircularProgress, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { ODataFieldParameter } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentContentContext, useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

export const AUI_APPLICATION_CONTENT_TYPE = 'AUIApplication'

type AUIApplicationContent = GenericContent & {
  Html?: string
}

type AUIApplicationBridgeFetchInit = {
  method?: string
  headers?: Record<string, string>
  body?: string
}

type AUIApplicationBridgeFetchRequest = {
  source: typeof AUI_APPLICATION_CONTENT_TYPE
  type: 'fetch'
  requestId: string
  input: string
  init?: AUIApplicationBridgeFetchInit
}

const makeSafeScriptJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c')

const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const getApplicationBaseUrl = (repositoryUrl: string, contentPath: string) => {
  const baseRepositoryUrl = repositoryUrl.replace(/\/+$/, '')
  const normalizedContentPath = contentPath.replace(/^\/+/, '').replace(/\/+$/, '')

  return `${baseRepositoryUrl}/${normalizedContentPath}/`
}

const getRepositoryRequestUrl = (repositoryUrl: string, input: string) => {
  const baseRepositoryUrl = repositoryUrl.replace(/\/+$/, '')
  const repositoryOrigin = new URL(baseRepositoryUrl).origin
  const requestUrl = new URL(input, `${baseRepositoryUrl}/`)

  if (requestUrl.origin !== repositoryOrigin) {
    throw new Error('AUIApplication requests are only allowed against the current repository.')
  }

  return requestUrl.toString()
}

const getBridgeRequestInit = (init?: AUIApplicationBridgeFetchInit): RequestInit => {
  const headers = new Headers(init?.headers)

  return {
    method: init?.method || 'GET',
    credentials: 'include',
    headers,
    body: init?.body,
  }
}

const createApplicationDocument = (
  html: string,
  repositoryUrl: string,
  adminUiUrl: string,
  content: AUIApplicationContent | undefined,
) => {
  const baseUrl = getApplicationBaseUrl(repositoryUrl, content?.Path ?? '')
  const bootstrap = `<base href="${escapeAttribute(baseUrl)}">
<meta charset="utf-8">
<script>
(() => {
  const pendingFetches = new Map();

  const normalizeHeaders = (headers) => {
    if (!headers) {
      return {};
    }

    if (typeof headers.forEach === 'function') {
      const normalizedHeaders = {};
      headers.forEach((value, key) => {
        normalizedHeaders[key] = value;
      });
      return normalizedHeaders;
    }

    if (Array.isArray(headers)) {
      return headers.reduce((normalizedHeaders, header) => {
        normalizedHeaders[header[0]] = header[1];
        return normalizedHeaders;
      }, {});
    }

    return headers;
  };

  const createBridgeResponse = (response) => ({
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    headers: {
      get: (name) => response.headers[String(name).toLowerCase()] || null,
      entries: () => Object.entries(response.headers),
    },
    text: () => Promise.resolve(response.body),
    json: () => Promise.resolve(JSON.parse(response.body)),
  });

  window.addEventListener('message', (event) => {
    const data = event.data || {};

    if (data.source !== ${makeSafeScriptJson(AUI_APPLICATION_CONTENT_TYPE)} || !data.requestId) {
      return;
    }

    const pendingFetch = pendingFetches.get(data.requestId);

    if (!pendingFetch) {
      return;
    }

    pendingFetches.delete(data.requestId);

    if (data.type === 'fetch:error') {
      pendingFetch.reject(new Error(data.error || 'AUIApplication fetch failed.'));
      return;
    }

    pendingFetch.resolve(createBridgeResponse(data.response));
  });

  window.sensenetAdminApp = {
    repositoryUrl: ${makeSafeScriptJson(repositoryUrl)},
    adminUiUrl: ${makeSafeScriptJson(adminUiUrl)},
    content: ${makeSafeScriptJson({
      Id: content?.Id,
      Path: content?.Path,
      Name: content?.Name,
      DisplayName: content?.DisplayName,
      Type: content?.Type,
    })},
    fetch: (input, init = {}) => {
      const requestId = \`\${Date.now()}-\${Math.random().toString(36).slice(2)}\`;

      return new Promise((resolve, reject) => {
        pendingFetches.set(requestId, { resolve, reject });
        window.parent.postMessage(
          {
            source: ${makeSafeScriptJson(AUI_APPLICATION_CONTENT_TYPE)},
            type: 'fetch',
            requestId,
            input,
            init: {
              method: init.method,
              headers: normalizeHeaders(init.headers),
              body: typeof init.body === 'string' ? init.body : undefined,
            },
          },
          '*',
        );
      });
    },
  };
})();
</script>`

  if (/<head[\s>]/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>\n${bootstrap}`)
  }

  if (/<html[\s>]/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1>\n<head>${bootstrap}</head>`)
  }

  return `<!doctype html>
<html>
  <head>
    ${bootstrap}
    <style>
      html,
      body {
        margin: 0;
        min-height: 100%;
      }
    </style>
  </head>
  <body>${html}</body>
</html>`
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      flex: '1 1 auto',
      minHeight: 0,
      width: '100%',
      backgroundColor: theme.palette.background.default,
    },
    frame: {
      width: '100%',
      height: '100%',
      display: 'block',
      border: 0,
      backgroundColor: '#fff',
    },
    status: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  }),
)

export const AUIApplicationView: React.FC = () => {
  const classes = useStyles()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const repository = useRepository()
  const logger = useLogger('AUIApplicationView')
  const currentContent = useContext(CurrentContentContext) as AUIApplicationContent
  const [content, setContent] = useState<AUIApplicationContent>()
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const idOrPath = currentContent.Id || currentContent.Path

  useEffect(() => {
    const abortController = new AbortController()

    if (!idOrPath) {
      setContent(undefined)
      return () => abortController.abort()
    }

    setIsLoading(true)
    setHasError(false)
    ;(async () => {
      try {
        const response = await repository.load<AUIApplicationContent>({
          idOrPath,
          requestInit: { signal: abortController.signal },
          oDataOptions: {
            select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Html'] as ODataFieldParameter<AUIApplicationContent>,
          },
        })

        if (!abortController.signal.aborted) {
          setContent(response.d)
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setHasError(true)
          logger.error({
            message: 'Failed to load AUIApplication content.',
            data: { error, relatedContent: currentContent },
          })
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    })()

    return () => abortController.abort()
  }, [currentContent, idOrPath, logger, repository])

  useEffect(() => {
    const handleBridgeMessage = async (event: MessageEvent<AUIApplicationBridgeFetchRequest>) => {
      if (event.source !== frameRef.current?.contentWindow) {
        return
      }

      const { data } = event

      if (data?.source !== AUI_APPLICATION_CONTENT_TYPE || data.type !== 'fetch' || !data.requestId || !data.input) {
        return
      }

      const postResponse = (message: Record<string, unknown>) => {
        frameRef.current?.contentWindow?.postMessage(
          {
            source: AUI_APPLICATION_CONTENT_TYPE,
            requestId: data.requestId,
            ...message,
          },
          '*',
        )
      }

      try {
        const requestUrl = getRepositoryRequestUrl(repository.configuration.repositoryUrl, data.input)
        const response = await repository.fetch(requestUrl, getBridgeRequestInit(data.init))
        const headers: Record<string, string> = {}

        response.headers.forEach((value, key) => {
          headers[key.toLowerCase()] = value
        })

        postResponse({
          type: 'fetch:success',
          response: {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers,
            body: await response.text(),
          },
        })
      } catch (error) {
        postResponse({
          type: 'fetch:error',
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    window.addEventListener('message', handleBridgeMessage)

    return () => window.removeEventListener('message', handleBridgeMessage)
  }, [repository])

  const applicationHtml = content?.Html?.trim() ?? ''
  const adminUiUrl = window.location.origin
  const srcDoc = useMemo(
    () => createApplicationDocument(applicationHtml, repository.configuration.repositoryUrl, adminUiUrl, content),
    [adminUiUrl, applicationHtml, content, repository.configuration.repositoryUrl],
  )

  if (isLoading) {
    return (
      <div className={classes.wrapper}>
        <div className={classes.status}>
          <CircularProgress size={24} />
          <Typography>Loading application...</Typography>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={classes.wrapper}>
        <div className={classes.status}>
          <Typography>Failed to load application HTML.</Typography>
        </div>
      </div>
    )
  }

  if (!applicationHtml) {
    return (
      <div className={classes.wrapper}>
        <div className={classes.status}>
          <Typography>This AUIApplication does not contain HTML yet.</Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.wrapper}>
      <iframe
        ref={frameRef}
        className={classes.frame}
        title={content?.DisplayName || currentContent.DisplayName || AUI_APPLICATION_CONTENT_TYPE}
        sandbox="allow-downloads allow-forms allow-modals allow-popups allow-scripts allow-top-navigation-by-user-activation"
        srcDoc={srcDoc}
      />
    </div>
  )
}
