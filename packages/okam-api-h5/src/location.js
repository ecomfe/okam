/**
 * @file The location API of the H5 app
 * @author congpeisen
 */

'use strict';

/* global window, navigator, document, BMap, BMAP_STATUS_SUCCESS */

import {loadScript} from './util/load';

function callback(fn, data) {
    typeof fn === 'function' && fn(data);
}

function loadMap(cb, baiduMapCustomUrl) {
    window.okamH5MapLoaded = () => {
        cb && cb();
    };
    loadScript(baiduMapCustomUrl || 'https://api.map.baidu.com/api?v=3.0&ak=PLoSaf7rMfvwrxqPfNAcHAyWqEnT4sjE&callback=okamH5MapLoaded');
}

export default {

    /**
     * Get location related information
     *
     * @param {Object} options the location options
     * @param {string} options.type the coordinate type
     * @param {boolean} options.altitude return altitude information
     * @param {Function} options.success success callback
     * @param {Function} options.fail fail callback
     * @param {Function} options.complete complete callback
     * @return {Object} promise
     */
    getLocation(options) {
        const {
            success,
            fail,
            complete,
            baiduMapCustomUrl
        } = options;

        let cacheLocation;
        const mapOptions = {
            enableHighAccuracy: true // 精准定位
        };

        // 浏览器API获取位置信息
        // const getCurrentPosition = (resolve, reject) => {
        //     const geolocation = navigator.geolocation;
        //     if (!geolocation) {
        //         const error = {code: -1, message: '当前浏览器不支持地理定位'};
        //         callback(fail, error);
        //         callback(complete, error);
        //         reject(error);
        //     }

        //     geolocation.getCurrentPosition(function (r) {
        //         let location = r.coords;
        //         cacheLocation = location;

        //         callback(success, location);
        //         callback(complete, location);

        //         resolve(location);
        //     }, function (r) {
        //         const error = {code: r.code, message: r};

        //         callback(fail, error);
        //         callback(complete, error);

        //         reject(error);
        //     }, mapOptions);
        // };

        // 百度地图API获取地理位置
        const getBMapCurrentPosition = (resolve, reject) => {
            const geolocation = new BMap.Geolocation(mapOptions);

            geolocation.getCurrentPosition(function (r) {
                // 若用户拒绝浏览器授权，accuracy == null
                if (this.getStatus() === BMAP_STATUS_SUCCESS && r.accuracy) {
                    let location = {
                        latitude: r.latitude,
                        longitude: r.longitude,
                        speed: r.speed,
                        accuracy: r.accuracy,
                        altitude: r.altitude,
                        verticalAccuracy: null,
                        horizontalAccuracy: null,
                        altitudeAccuracy: r.altitudeAccuracy,
                        street: r.address.street,
                        cityCode: r.address.city_code,
                        city: r.address.city,
                        country: r.address.country || null,
                        province: r.address.province,
                        streetNumber: r.address.street_number,
                        district: r.address.district
                    };

                    cacheLocation = location;

                    callback(success, location);
                    callback(complete, location);
                    resolve(location);
                }
                else {
                    const error = {code: this.getStatus(), message: r};
                    callback(fail, error);
                    callback(complete, error);
                    reject(error);
                }
                // BMap.Geolocation.getCurrentPosition会在dom中插入一段iframe，获取位置后移除
                const queryStr = 'iframe[src*="//api.map.baidu.com/res/staticPages/location.html"]';
                const bdmap = document.querySelector(queryStr);
                bdmap && bdmap.remove();
            }, function (r) {
                const error = {code: this.getStatus(), message: r};
                callback(fail, error);
                callback(complete, error);
                reject(error);
            });
        };

        return new Promise((resolve, reject) => {
            // 百度域下使用百度地图API，非百度域使用宿主API
            // if (~location.hostname.indexOf('baidu.com')) {
            if (typeof BMap !== 'undefined') {
                if (cacheLocation) {
                    resolve(cacheLocation);
                }
                else {
                    getBMapCurrentPosition(resolve, reject);
                }
            }
            else {
                loadMap(_ => {
                    getBMapCurrentPosition(resolve, reject);
                }, baiduMapCustomUrl);
            }
            // }
            // else {
            //     getCurrentPosition(resolve, reject)
            // }
        });

    },

    /**
     * Open map location
     *
     * @param {string} options.latitude latitude data
     * @param {string} options.longitude longitude data
     * @param {number} options.scale scale proportion
     * @param {string} options.name location name
     * @param {string} options.address detailed description of address
     * @param {Function} options.success success callback
     * @param {Function} options.fail fail callback
     * @param {Function} options.complete complete callback
     * @return {Object} promise
     */
    openLocation(options) {
        const {
            latitude,
            longitude,
            scale,
            name,
            address,
            success,
            fail,
            complete
            // baiduMapCustomUrl
        } = options;

        return new Promise((resolve, reject) => {
            if (latitude && longitude) {
                // 暂时使用跳转api跳转百度地图
                window.open(
                    `http://api.map.baidu.com/marker?location=${latitude},${longitude}&title=${name}&content=${address}&zoom=${scale}&output=html&coord_type=gcj02&src=webapp.baidu.okamAPIdemo`
                );
                callback(success);
                callback(complete);
                resolve();
            }
            else {
                callback(fail);
                callback(complete);
                reject();
            }
        });

        // function openBMap(resolve, reject) {
        //     let node = document.createElement('div');
        //     node.id = 'okam-bmap-container';
        //     document.body.appendChild(node);

        //     let map = new BMap.Map('okam-bmap-container');
        //     let point = new BMap.Point(116.404, 39.915);
        //     console.log(map, point);
        //     map.centerAndZoom(point, 15);
        //     map.enableScrollWheelZoom(true);
        // }

        // return new Promise((resolve, reject) => {
        //     if (typeof BMap !== 'undefined') {
        //         openBMap(resolve, reject);
        //     } else {
        //         loadMap(_ => {
        //             openBMap(resolve, reject);
        //         }, baiduMapCustomUrl);
        //     }
        // });
    }
};
