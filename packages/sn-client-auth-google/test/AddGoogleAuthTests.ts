import * as Chai from 'chai';
import { suite, test } from 'mocha-typescript';
import { MockRepository } from 'sn-client-js/dist/test/Mocks';
import { AddGoogleAuth, GoogleAuthenticationOptions, GoogleOauthProvider } from '../src';

const expect = Chai.expect;

@suite('RepositoryExtensions')
export class AddGoogleAuthTests {

    @test
    public 'Can be configured on a Repository'() {
        const repo = new MockRepository();
        const config = new GoogleAuthenticationOptions({ClientId: ''});
        AddGoogleAuth(repo, config);
        expect(repo).to.be.instanceof(MockRepository);
        expect(repo.Authentication.GetOauthProvider(GoogleOauthProvider)).to.be.instanceof(GoogleOauthProvider);
    }

}
