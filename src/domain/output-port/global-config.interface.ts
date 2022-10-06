export interface IGlobalConfig {
    get<R>(key: string): R;
    set<R>(key: string, value: R): void;
    stringify(): string;
};
