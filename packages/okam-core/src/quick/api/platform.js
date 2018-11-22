/**
 * @file The platform API of the quick app
 * @author sparklewhy@gmail.com
 */

'use strict';

import device from '@system.device';

export default {

    /**
     * Get system info async.
     * It'll normalize the response system info following the weixin
     * response info format.
     *
     * The following system info property return in weixin and mapping rules with
     * quick app:
     * {
     *     brand: 'xiaomi',
     *     model: 'MI 6X',
     *     pixelRatio: 2.75, // not supported in quick app
     *     screenWidth: 393, // in quick app, the value is `screenWidth * pixRatio` = 1080
     *     screenHeight: 738, // in quick app, the value is `screenHeight * pixRatio` = 2030
     *     windowWidth: 393, // not supported in quick app
     *     windowHeight: 666, // not supported in quick app
     *     statusBarHeight: 24, // not supported in quick app
     *     language: 'zh_CN', // here is weixin app language setting value, in
     *                        // quick app the value is `zh`, it means the system language
     *     version: '6.7.3', // the weixin app version, not supported in quick app
     *     system: 'Android 8.1.0', // in quick app, has other property containing
     *                              // this info, `osType`: 'android', `osVersionName`: '8.1.0'
     *     platform: 'android', // in quick app, it uses `osType` property
     *     fontSizeSetting: 16, // not supported in quick app
     *     SDKVersion: '2.4.1', // in quick app, it uses `platformVersionCode` instead
     *     benchmarkLevel: '',  // only for android mini game, not supported in quick app
     * }
     *
     * @param {Object} options the options
     * @param {Function=} options.success the request success callback
     * @param {Function=} options.fail the request fail callback
     * @param {Function=} options.complete the request done callback whatever is
     * @return {*}
     */
    getSystemInfo(options) {
        let formatData = function (res) {
            // cache the old language value using `lang` property
            res.lang = res.language;
            res.language = `${res.lang}_${res.region}`;

            let osType = res.osType;
            res.platform = osType;
            res.system = `${osType} ${res.osVersionName || ''}`;

            // convert number type value like `1020` to string
            res.SDKVersion = '' + res.platformVersionCode;
        };

        let opts = Object.assign({}, options);
        let {success: oldSuccess, complete: oldComplete} = opts;
        oldSuccess && (opts.success = res => {
            formatData(res);
            oldSuccess(res);
        });
        oldComplete && (opts.complete = res => {
            if (res && typeof res === 'object' && res.platformVersionCode) {
                formatData(res);
            }
            oldComplete(res);
        });
        return device.getInfo(opts);
    }
};
