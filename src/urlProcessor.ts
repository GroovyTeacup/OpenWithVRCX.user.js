export interface IProcessor {
    load(): void;
    processUrl(url: URL): void;
}