import qs from 'qs';
import Storage from './Storage';
import Db from './Db'

export default class Client{

    headers = {};
    baseUrl = '';
    db ={};

    /**
     * @param baseUrl {string}
     * @param headers {Object}
     * @param db {Object|null}
     */
    constructor (baseUrl = '', headers = {}, db = Db) {
        if (!baseUrl) {
            throw new Error('missing baseUrl');
        }

        Object.assign(this.headers, headers);
        this.baseUrl = baseUrl;
        this.db = db;
    }

    /**
     * Получаем полный URL
     * @param url
     * @returns {string}
     * @private
     */
    _fullRoute (url) {
        return `${this.baseUrl}${url}`;
    }

    /**
     *
     * @param route {string}
     * @param method {string}
     * @param body {Object}
     * @param isQuery {boolean}
     * @returns {Promise.<Object>|*}
     * @private
     */
    _fetch (route, method, body, isQuery = false) {
        if (!route) {
            throw new Error('Route is undefined');
        }

        let fullRoute = this._fullRoute(route);
        if (isQuery && body) {
            const query = qs.stringify(body);
            fullRoute = `${fullRoute}?${query}`;
            body = undefined;
        }
        let opts = {
            method,
            headers: this.headers
        };
        if (body) {
            Object.assign(opts, { body: JSON.stringify(body) });
        }

        const storage = new Storage(fullRoute, opts, this.db);

        const fetchPromise = () => storage.fetch();

        return fetchPromise()
            .then(response => response.json());
    }

    GET (route, query) { return this._fetch(route, 'GET', query, true); }
    POST (route, body) { return this._fetch(route, 'POST', body); }
    PUT (route, body) { return this._fetch(route, 'PUT', body); }
    DELETE (route, query) { return this._fetch(route, 'DELETE', query, true); }
};