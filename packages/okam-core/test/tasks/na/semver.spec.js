/**
 * @file na/semver test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import * as semver from 'core/na/semver';

describe('na/semver', function () {

    it('should return version compare info', () => {
        assert(semver.compare('1', '0.3.2') === 1);
        assert(semver.compare('0.1', '0.3.2') === -1);
        assert(semver.compare('0.2.1', '0.2.1') === 0);
        assert(semver.compare('0.21', '0.21.0') === 0);
    });

    it('should return true when version is newer', () => {
        assert(semver.gt('1', '0.3.2') === true);
        assert(semver.gt('0.3.2', '1') === false);
        assert(semver.gt('0.3.2', '0.3') === true);
        assert(semver.gt('0.3.3', '0.3.3') === false);
    });

    it('should return true when version is older', () => {
        assert(semver.lt('0.3.2', '1') === true);
        assert(semver.lt('0.3', '0.3.2') === true);
        assert(semver.lt('0.3.2', '0.3') === false);
        assert(semver.lt('1', '2') === true);
        assert(semver.lt('2', '1') === false);
        assert(semver.lt('2.3', '2.3.0') === false);
    });

    it('should return true when version is the same', () => {
        assert(semver.eq('1.0.0', '1') === true);
        assert(semver.eq('1.0.0', '1.1') === false);
        assert(semver.eq('0.0.0', '0') === true);
    });
});
