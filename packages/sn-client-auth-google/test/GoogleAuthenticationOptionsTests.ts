import * as Chai from 'chai';
import { suite, test } from 'mocha-typescript';
import { GoogleAuthenticationOptions } from '../src';

const expect = Chai.expect;

// (global as any).window = {} as any;

@suite('Google Authentication Options Tests')
export class GoogleAuthenticationOptionsTests {
    @test
    public 'Options can be constructed with valid default parameters'() {
        const exampleOrigin = 'http://example.origin.com';
        const exampleClientId = 'exampleAppId';
        (global as any).window = {
            location: {
                origin: exampleOrigin
            }
        };
        // tslint:disable-next-line:no-unused-expression
        window;
        const options = new GoogleAuthenticationOptions({
            ClientId: exampleClientId
        });
        expect(options).to.be.instanceof(GoogleAuthenticationOptions);
        expect(options.ClientId).to.be.eq(exampleClientId);
        expect(options.RedirectUri).to.be.eq(exampleOrigin + '/');
        expect(options.Scope).to.be.deep.eq(['email', 'profile']);
    }

    @test
    public 'Options can be constructed with valid specified parameters'() {
        const exampleClientId = 'ExampleClientId2';
        const exampleRedirectUri = 'exampleRedirectUri';
        const exampleScope = ['item1', 'item2'];

        const options = new GoogleAuthenticationOptions({
            ClientId: exampleClientId,
            RedirectUri: exampleRedirectUri,
            Scope: exampleScope
        });

        expect(options).to.be.instanceof(GoogleAuthenticationOptions);
        expect(options.ClientId).to.be.eq(exampleClientId);
        expect(options.RedirectUri).to.be.eq(exampleRedirectUri);
        expect(options.Scope).to.be.deep.eq(exampleScope);

    }
}
