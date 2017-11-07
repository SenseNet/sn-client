import * as Chai from 'chai';
import { suite, test } from 'mocha-typescript';
import { MockRepository } from 'sn-client-js/dist/test/Mocks';
import { GoogleAuthenticationOptions, GoogleAuthenticationService } from '../src';

import '../src/SnRepositoryExtensions';

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
        const googleAuthRepo = repo.SetupGoogleAuth({ApiKey: 'ASD123'});
        expect(googleAuthRepo).to.be.instanceof(MockRepository);
        expect(googleAuthRepo.Authentication).to.be.instanceof(GoogleAuthenticationService);
    }

    @test
    public 'GoogleLogin can be called'() {
        const repo = new MockRepository();
        const googleAuthRepo = repo.SetupGoogleAuth({ApiKey: 'ASD123'});
        googleAuthRepo.Authentication.GoogleLogin();
    }

}
