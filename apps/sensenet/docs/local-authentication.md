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
