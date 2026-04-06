import { BaseService } from './BaseService';

class InfoService extends BaseService {
    constructor() {
        super('info'); // Appends '/info' to base URL
    }

    async getInfo(): Promise<string> {
        return this.get<string>('/GetInfo');
    }

    async getGameApi(): Promise<string> {
        return this.get<string>('/getGameApi');
    }
   
}

export const infoService = new InfoService();
