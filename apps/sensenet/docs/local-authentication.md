# Internal repository authentication (SB-167)

The Admin UI discovers `/authentication/capabilities` before mounting an external provider.
A 404 preserves the legacy SNAuth/IdentityServer flow. Other discovery errors do not select local
authentication. Secondary displays an explicit external/internal choice; InternalOnly opens the local
login form. Deep-link paths remain intact. A local session is restored only for the selected repository.

Local login sends the repository username, password and optional MFA verification code to the fixed
repository login endpoint over HTTPS. Passwords and MFA codes are not stored. Tokens live in
sessionStorage, scoped by normalized repository URL and issuer; they are separate from SNAuth/OIDC storage
and are cleared by logout/session loss. Browser tabs do not share a live local session after opening
(the browser may initially copy sessionStorage when duplicating a tab).

All local repository calls, including binary fetches through Repository.fetch, use the local bearer
transport with cookies omitted and redirects rejected. Tokens cannot be sent outside the repository
origin/path. Refresh is single-flight, uses a ten-second expiry margin, and retries a 401 only once.
Logout/refresh races cannot restore a cleared session. Logout calls only the local endpoint; a failed
server revocation is shown separately from successful local cleanup.

The navigation repository selector supports multiple saved local sessions. Select another repository
from the login screen to establish a new one. Local and external providers use separate session lists.
The current user returned by the repository must match the JWT subject before protected content renders.


For an Admin UI hosted on the repository's own origin, open `/login` (or `/login/`).
Without a `repoUrl` query parameter, this selects `window.location.origin` and uses the normal
capability discovery and authentication policy. An explicit `repoUrl` still takes precedence,
including on `/login`, so shared Admin UI deployments can target another repository. Other paths
do not infer a repository from their origin. Configure the web server to serve the SPA for `/login`
and forward the repository API and authentication endpoints to the backend.

## Server prerequisites

Enable the optional server module in the matching sensenet SB-167 branch. Configure HTTPS, signing
keys, allowed login/token CIDRs, trusted proxies, user/group allowlists and MFA. Permit the Admin UI
origin through the repository's existing CORS settings. Disable AddJwtCookie for the local module.
Provider availability is server policy; the UI never enables internal auth during an external outage.

## Validation

```powershell
# Use Jest 29 with the project's jsdom 29 / ts-jest 29 dependencies.
yarn workspace @app/sensenet test --runInBand local-authentication
yarn workspace @app/sensenet build:snauth
yarn workspace @app/sensenet build:idserver
```

The new tests cover explicit provider choices, deep links, form credentials/MFA, current-user
verification, session isolation, refresh concurrency, bounded retries and logout/session loss.
They use controlled HTTP responses. Production SNAuth and IdentityServer bundles compile;
a live browser-to-repository deployment still needs environment-specific smoke testing.

## Native local login and repository branding

The local login is rendered by Admin UI, using native HTML/CSS controls. Its SNAuth-style
layout, mountain background, sensenet logo and Spartan fonts are bundled locally.
The repository remains a separate API application.

The selected repository's capabilities return `local.appearance`: title, backgroundImageUrl,
logoUrl, backgroundColor, brandColor (left panel), buttonColor, buttonTextColor, textColor
and panelColor (form panel). Images must be public HTTPS assets; colors are hex values.
Invalid values fall back to the bundled defaults. Reconfigure the repository and reload
the UI to change its appearance, without rebuilding this app.
See the backend's `docs/local-authentication.md` for environment/configuration examples.

When `local.mfa` is advertised, login uses a separate authenticator step. After password
verification the repository may return an enrollment QR/manual key. Passwords and authenticator codes are never saved in React state or browser storage.
The MFA challenge/setup key lives only in component memory until verification or navigation.
A session is saved only after successful verification. Existing repositories without
the progressive MFA endpoint retain the legacy combined credentials/code form.

Forgot password appears only when the repository advertises recovery. It sends only the
email address to that repository's fixed endpoint; the trusted email return URL is a
server setting. The email link contains `repoUrl` and `#localResetToken=...`. The UI removes
the fragment immediately, prevents automatic session restoration, asks for matching new
passwords, and requires a normal sign-in after reset. MFA remains enabled. Do not add
analytics or request logging that captures this fragment or credential form data.

## Build a new local container from source

From the sn-client repository root:

```powershell
docker build -t local/sn-adminui:sb167 .
if ($LASTEXITCODE -ne 0) { throw 'Admin UI build failed' }
# Choose a free port, or stop the old container using 8080 first.
docker run -d --name sb167-adminui-source -p 127.0.0.1:8080:8080 local/sn-adminui:sb167
```

Open `http://localhost:8080/?repoUrl=https%3A%2F%2Finsql-daily.test.sensenet.cloud`.
This Dockerfile installs the locked dependencies and builds the source; `docker start`
alone only restarts an already created container and does not rebuild code.
After another source change, build again, remove/recreate only this local UI container.
The test backend's recovery ResetUrl should be `http://localhost:8080/`.

Targeted tests (from the repository root with the installed workspace dependencies):

```powershell
$env:NODE_ENV='test'
node -e "require('./packages/sn-auth-react/node_modules/jest').run(process.argv.slice(1))" -- --config apps/sensenet/jest.config.js --runInBand local-authentication local-login-page
```

Use Jest 29; a hoisted legacy Jest 27 binary is incompatible with this jsdom environment.
The integration tests include reset-fragment removal, native form rendering, progressive
MFA, recovery confirmation, provider selection, token isolation and legacy compatibility.
