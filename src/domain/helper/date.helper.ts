
function isStringIsoDate(str: string) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d: Date = new Date(str); 
    return d instanceof Date && d.toISOString()===str; // valid date 
  }

export const convertAnyToDate = (d: any): Date => {
    if (d instanceof Date) { //typeof: object
        return d;
    };
    //ISOString
    if (typeof d === "string") { //typeof: string
        return new Date(d);
    }
    throw new Error('Could not convert data to date');
};