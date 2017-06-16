import { NetInfo } from 'react-native';
import Db from './Db'

export default class Storage {

    /**
     *
     * @param fullRoute {string}
     * @param params {Object}
     * @param db {Db|Object}
     */
    constructor(fullRoute = '', params = {}, db = Db) {
        this.fullRoute = fullRoute;
        this.params = params;
        this.db = new db();
        this.hash = this.fullRoute;
    }

    /**
     * Синхронизируем данные при восстановлении соединения
     * @param isConnected
     */
    fetchDataWhenOnline(isConnected) {
        if (isConnected) {
            const fetchPromise = () => fetch(this.fullRoute, this.params);
            fetchPromise()
                .then(response => response.json())
                .then(responseData => {
                    this.db.insert(this.hash, JSON.stringify(this.params), JSON.stringify(responseData));
                    NetInfo.isConnected.removeEventListener(
                        'change',
                        fetchDataWhenOnline
                    );
                });
        }
    }

    /**
     * Получаем данные
     * @returns {Promise.<Object>|*}
     */
    fetch() {

        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                const fetchPromise = () => fetch(this.fullRoute, this.params);

                return fetchPromise()
                    .then(response => response.json())
                    .then(responseData => {
                        return new Promise(function (resolve, reject) {
                            this.db.insert(this.hash, JSON.stringify(this.params), JSON.stringify(responseData));
                            resolve(responseData);
                            reject(new Error("DB Error"));
                        })
                    });
                /**
                 * Нет подключения к интернету
                 */
            } else {
                /**
                 * Добавляем обработчик события появления интернета
                 */
                NetInfo.isConnected.addEventListener(
                    'change',
                    this.fetchDataWhenOnline
                );

                return new Promise(function(resolve, reject) {
                    let result = this.db.getById(this.hash);
                    resolve(result);
                    reject(new Error("DB Error"));
                });

            }
        });
    }
}