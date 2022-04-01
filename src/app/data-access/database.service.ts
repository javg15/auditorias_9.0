import {Injectable} from '@angular/core';
import {Connection, ConnectionOptions, createConnection} from 'typeorm';
import {Settings} from './repositories/settings';
import {User} from './entities/user.entity';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    public connection: Promise<Connection>;
    private readonly options: ConnectionOptions;

    constructor() {
        Settings.initialize();
        console.log("Settings.dbPath=>",Settings.dbPath)
        this.options = {
            type: 'sqlite',
            database: Settings.dbPath,
            entities: [User],
            synchronize: true,
            logging: 'all',
        };
        /*this.options = {
            type: 'sqlite',
            database: 'sqlite3.db',
            entities: [User],
            synchronize: true,
            logging: 'all',
        };*/
        this.connection = createConnection(this.options);
    }
}
