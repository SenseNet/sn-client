import * as Chai from 'chai';
import { suite, test } from 'mocha-typescript';
import { MockRepository } from 'sn-client-js/dist/test/Mocks';
import { AddGoogleAuth, GoogleAuthenticationOptions, GoogleAuthenticationService } from '../src';

const expect = Chai.expect;

@suite('RepositoryExtensions')
export class RepositoryExtensionsTests {

    @test
    public 'Options can be constructed'() {
        const options = new GoogleAuthenticationOptions();
        expect(options).to.be.instanceof(GoogleAuthenticationOptions);
    }

    @test
    public 'Can be configured on a Repository'() {
        const repo = new MockRepository();
        const config = new GoogleAuthenticationOptions();
        AddGoogleAuth(repo, config);

        expect(repo).to.be.instanceof(MockRepository);
        expect(typeof repo.Authentication.GetOauthProvider(GoogleAuthenticationService)).to.be.instanceof(GoogleAuthenticationService);
    }

}
