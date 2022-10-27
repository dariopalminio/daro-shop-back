/**
 * Global Config Interface
 * 
 * Generic interface for your global congiguration.
 * The idea is that environment variables or the configuration file system cannot be accessed directly from the domain, but rather through an 'output port'.
 * 
 * Note: This interface works as output port. An output port (driven port) is another type of interface that is used by the application core 
 * to reach things outside of itself (like getting some data from file system or environment variables).
 */
export interface IGlobalConfig {
    get<R>(key: string): R;
    set<R>(key: string, value: R): void;
    stringify(): string;
};
