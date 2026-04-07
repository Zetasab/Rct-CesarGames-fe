import { BaseService } from './BaseService';

class InfoService extends BaseService {
    constructor() {
        super('info'); // Appends '/info' to base URL
    }

    async getInfo(): Promise<string> {
        return this.get<string>('/GetInfo');
    }
   
}

export const infoService = new InfoService();
