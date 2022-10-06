import { IAddress } from "../profile/address.interface";

export type UserDTO = {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: string[];
  };