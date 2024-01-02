import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import { v4 as uuidv4 } from 'uuid';
import { userEntity } from '../../types/user';
import dotenv from 'dotenv';
import { logger } from '../../helpers/logger';

dotenv.config();

export class refresh_token extends Model<InferAttributes<refresh_token>, InferCreationAttributes<refresh_token>> {
  declare id: CreationOptional<number>;
  declare userId: string;
  declare token: string;
  declare expiryDate: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static createToken: (user: any) => Promise<any>;
  static verifyExpiration: (token: any) => boolean;
}

refresh_token.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'user',
        key: 'id',
      },
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, tableName: 'refresh_tokens', timestamps: true },
);

refresh_token.verifyExpiration = function (token: any) {
  console.log(token.expiryDate.getTime(), new Date().getTime());
  return token.expiryDate.getTime() < new Date().getTime();
};

refresh_token.createToken = async function (user: any) {
  let expiredAt: any = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRATION);
  let _token = uuidv4();
  let refreshToken = await refresh_token.create({
    token: _token,
    userId: user.id,
    expiryDate: expiredAt.getTime(),
  });
  return refreshToken.token;
};

export default refresh_token;
