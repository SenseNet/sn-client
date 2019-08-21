import React from 'react'
import { OAuthButton } from './OAuthButton'

export const GoogleAuthButton = () => {
  // Mixing JWT with Forms is not safe at the moment.

  // const repository = useRepository()
  // const googleOauthProvider = useRef<GoogleOauthProvider>()
  // useEffect(() => {
  //   const jwt = new JwtService(repository)
  //   googleOauthProvider.current = addGoogleAuth(jwt, {
  //     clientId: '', // We are going to add this later
  //   })
  //   return () => {
  //     jwt.dispose()
  //     googleOauthProvider.current && googleOauthProvider.current.dispose()
  //   }
  // }, [repository])
  // const onClickHandler = () => {
  //   googleOauthProvider.current && googleOauthProvider.current.login()
  // }
  // return <OAuthButton buttonProps={{ onClick: onClickHandler, disabled: true }} buttonText="Google" iconName="google" />
  return <OAuthButton buttonProps={{ disabled: true }} buttonText="Google" iconName="google" />
}
