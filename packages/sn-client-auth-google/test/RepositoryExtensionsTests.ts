import * as Chai from 'chai';
import { suite, test } from 'mocha-typescript';
import { MockRepository } from 'sn-client-js/dist/test/Mocks';
import { GoogleAuthenticationService } from '../src/GoogleAuthenticationService';

import '../src/SnRepositoryExtensions';

const expect = Chai.expect;

@suite('RepositoryExtensions')
export class RepositoryExtensionsTests {
    @test
    public 'Can be constructed'() {
        const repo = new MockRepository();
        const googleAuthRepo = repo.SetupGoogleAuth({ApiKey: 'ASD123'});
        expect(googleAuthRepo).to.be.instanceof(MockRepository);
        expect(googleAuthRepo.Authentication).to.be.instanceof(GoogleAuthenticationService);
    }
}
