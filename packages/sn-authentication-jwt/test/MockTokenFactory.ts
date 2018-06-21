import { ITokenPayload } from "../src/ITokenPayload";
import { Token } from "../src/Token";

// tslint:disable
export class MockTokenFactory {
    private static getStillValidDate(addMs: number = 3000000) {
        const date = new Date();
        date.setTime(date.getTime() + addMs);
        return date.getTime() / 1000;
    }

    private static createWithDates(expiration: number, notBefore: number): Token {
        const header = {};
        const payload = {
            aud: "",
            exp: expiration,
            iat: 0,
            iss: "",
            name: "BuiltIn\\Mock",
            nbf: notBefore,
            sub: "",
        } as ITokenPayload;

        const headerEncoded = Buffer.from(JSON.stringify(header)).toString("base64");

        const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64");
        return Token.FromHeadAndPayload(`${headerEncoded}.${payloadEncoded}`);
    }

    public static CreateValid() {
        return this.createWithDates(this.getStillValidDate(), 1);
    }

    public static CreateExpired() {
        return this.createWithDates(1, this.getStillValidDate());
    }

    public static CreateNotValidYet(notBefore?: number) {
        return this.createWithDates(this.getStillValidDate(), this.getStillValidDate(notBefore));
    }
}
