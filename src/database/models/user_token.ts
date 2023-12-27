import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class user_token extends Model<InferAttributes<user_token>, InferCreationAttributes<user_token>> {
  declare id: CreationOptional<number>;
  declare userId: string;
  declare token: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

user_token.init(
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
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, tableName: 'user_tokens', timestamps: true },
);

export default user_token;
