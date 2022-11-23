export interface IDocHelper {
    unformatDoc(formattedDoc: string): string;
    formatDoc(unformattedDoc: string): string;
    isDocValid(doc: string | null | undefined): boolean;
};