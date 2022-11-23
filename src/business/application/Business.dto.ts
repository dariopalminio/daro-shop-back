import { IBusiness } from "../domain/Business.entity";


export class BusinessDTO  implements IBusiness{

taxIdNum: string;
socialReason: string;
fantasyName: string;
activity: string;
addressLine: string;
email: string;
phone: string;
message: string;

};
