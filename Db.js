import {SQLite} from 'react-native-sqlite-storage';

let instance = null;

/**
 * Singleton
 */
export default class Db {

    constructor() {
        if(!instance){
            instance = this;
        }

        this.db = SQLite.openDatabase("db.db", "1.0", "Database", 200000, this._openCB, this._errorCB);

        this.db.transaction((tx) => {
            tx.executeSql('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'request\';', [], (tx, results) => {
                //Если таблица отсутствует
                if (results.rows.length === 0 ) {
                    throw new Error('No table found');
                }
            });
        });

        return instance;
    }

    getById(id) {
        this.db.transaction((tx) => {
            tx.executeSql('SELECT * FROM request WHERE id=\''+id+'\';', [], (tx, results) => {
                const row = results.rows[0];
                return row.response ? row.response : null ;
            });
        });
    }

    /**
     * Добавить данные
     * @param id {string}
     * @param params {string}
     * @param response {string}
     */
    insert(id, params, response) {
        this.deleteById(id);
        this.db.transaction((tx) => {
            tx.executeSql('INSERT INTO `request`(`id`,`params`,`response`) VALUES (\''+id+'\',\''+params+'\',\''+response+'\');', [], () => {});
        });
    }

    /**
     * Удаление записи
     * @param id
     */
    deleteById(id) {
        this.db.transaction((tx) => {
            tx.executeSql('DELETE FROM `request` WHERE `id`=\''+id+'\';', [], () => {});
        });
    }

    /**
     *
     * @param err
     * @private
     */
    _errorCB(err) {
        throw new Error("SQL Error: " + err)
    }

    _successCB() {
        // console.log("SQL executed fine");
    }

    _openCB() {
        // console.log("Database OPENED");
    }
}