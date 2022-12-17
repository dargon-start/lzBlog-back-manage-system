interface Iuser {
  email: string;
  password: string;
  code?: string;
}
interface IloginType {
  id: number;
  name: string;
  token: string;
}

export type {Iuser, IloginType};
