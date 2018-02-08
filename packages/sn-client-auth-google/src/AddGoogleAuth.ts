import { JwtService } from "@sensenet/authentication-jwt";
import { GoogleAuthenticationOptions } from "./GoogleAuthenticationOptions";
import { GoogleOauthProvider } from "./GoogleOauthProvider";

/**
 * Registers an OAuth Provider to the specified Repository instance
 * @param repo The Google Authentication services will be registered into this repository instance
 * @param options Additional options to the Google OAuth Provider
 */
export const addGoogleAuth = (jwtService: JwtService, options: Partial<GoogleAuthenticationOptions> & { clientId: string }) => {
    const newOptions = new GoogleAuthenticationOptions(options);
    const providerInstance = new GoogleOauthProvider(jwtService, newOptions);
    jwtService.oauthProviders.add(providerInstance);
    return providerInstance;
};
