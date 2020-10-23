/**
 * @file storage test spec
 * @author magicchewl@gmail.com
 */
import expect from 'expect';
import api from 'api/authrize';

describe('API [authorize]', () => {
    it('success callback should be called', done => {
        api.authorize({
            success: () => {
                done();
            }
        });
    });
});

describe('API [openSetting]', () => {
    it('openSetting is not supported', done => {
        try {
            api.openSetting();
        } catch (e) {
            done();
        }
    });
});

describe('API [getSetting]', () => {
    it('getSetting returns correctly value', done => {
        api.getSetting({
            success: res => {
                expect(res.authSetting).toContainKey('scope.userLocation');
                expect(res.authSetting).toContainKey('scope.userInfo');
                expect(res.authSetting).toContainKey('scope.address');
                expect(res.authSetting).toContainKey('scope.invoiceTitle');
                done();
            }
        });
    });
});

