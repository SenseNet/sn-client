import { Repository } from "@sensenet/client-core";
import { IOauthProvider } from "../src/IOauthProvider";

export class MockOauthProvider implements IOauthProvider {
    public getToken(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    public login(token: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}
