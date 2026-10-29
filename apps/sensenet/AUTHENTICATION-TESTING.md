# Authentication acceptance tests

Changes are on `codex/auth-lifecycle-fixes`, based on merged PR #1655.
The separate `SenseNet/sn-auth` branch with the same name is required for secure
SNAuth external login. Deploy the server first; it still supports older clients.
The new client reports an error for an old server's unbound callback.

Use the usual Chrome profile with existing repository history and sessions.
Record the AdminUI commit/build, browser, repository, authentication mode and
result for each case. Do not clear all browser storage as a test prerequisite.
Use test users and avoid recording tokens or passwords in evidence.

| Case                                                    | IdentityServer           | SNAuth | Local/internal   | Expected result                                                                            |
| ------------------------------------------------------- | ------------------------ | ------ | ---------------- | ------------------------------------------------------------------------------------------ |
| Login, reload, logout, login again                      | Yes                      | Yes    | Yes              | Correct identity and usable signed-out view; logout does not hang.                         |
| Switch A → B → A                                        | Yes                      | Yes    | Yes              | Correct repository and identity; other sessions remain available.                          |
| Local → external login and callback                     | Yes                      | Yes    | Source is Local  | Correct auth mode survives callback/reload; old Local session remains available.           |
| Let an access token expire                              | Yes                      | Yes    | Yes              | One refresh operation; UI and requests use the refreshed token.                            |
| Logout while refresh/current-user request is delayed    | Yes                      | Yes    | Yes              | Old response cannot restore a logged-out session or overwrite a later login.               |
| A → B → A while A's request is delayed, then logout A   | Yes                      | Yes    | Yes              | A stays logged out when the old request completes; B is unaffected.                        |
| Network/issuer failure at startup or refresh            | Yes                      | Yes    | Yes              | Loading finishes with an understandable error and a usable retry/selection action.         |
| Logout endpoint fails or stalls                         | Yes                      | Yes    | Yes              | Recoverable UI; SNAuth clears locally immediately and warns if revocation is unconfirmed.  |
| Login while an earlier Local logout is pending          | —                        | —      | Yes              | Completing the old logout does not clear the new identity.                                 |
| Repeated mount/switch/expiry                            | Yes                      | —      | —                | Event subscriptions are removed; one expiry does not trigger duplicate silent renewals.    |
| Unsolicited, wrong-state or replayed callback           | OIDC's existing protocol | Yes    | —                | SNAuth does not convert/persist tokens; it shows an error and allows repository selection. |
| Password login, remembered login, MFA retry/success     | Existing provider        | Yes    | Where configured | Same intended browser transaction completes, with the correct user.                        |
| Registration and forgotten-password navigation/recovery | Existing provider        | Yes    | Where configured | Return to login preserves the pending transaction; completed login succeeds.               |
| Two browser sessions using the same user                | Existing provider        | Yes    | Yes              | Logging out one preserves the other when server policy allows parallel sessions.           |

The existing bare-root automatic restoration of a previously selected repository
is intentionally unchanged. The explicit Choose another repository/Switch action
must remain usable. An old SNAuth server is an expected compatibility error for
the new client, not a reason to weaken callback validation.

Automated checks use the app Jest configuration for the Local/OIDC/SNAuth wrapper
and package regression suites, plus both IdentityServer and SNAuth production
webpack builds. The server has independent HTTP, proof, MFA, expiry and session
tests. These checks support review; live provider acceptance is a separate step.
