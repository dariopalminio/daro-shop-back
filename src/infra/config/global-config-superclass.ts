import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';


/**
 * Global Config superclass
 */
export class GlobalConfigSuperclass implements IGlobalConfig{
    
    protected variables: Map<string, any> = new Map();

    constructor(
    ) { 
    };

    get<R>(key: string): R {
        return this.variables.get(key) as R;
    };

    set<R>(key: string, value: R): void {
        this.variables.set(key,value);
    };

    stringify(): string {
        return JSON.stringify(Object.fromEntries(this.variables)); 
    };

};
