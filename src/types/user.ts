export declare type userEntity = {
  id?: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
  status: boolean;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export declare type userLoginEntity = {
  email: string;
  password: string;
};

export declare type Token = {
  id?: string;
  userId: any;
  token: string;
};
