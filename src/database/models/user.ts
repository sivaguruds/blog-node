import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import refresh_token from './refresh_token';
import user_token from './user_token';

export class user extends Model<InferAttributes<user>, InferCreationAttributes<user>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare mobile: string;
  declare email: string;
  declare password: string;
  declare status: boolean;
  declare role: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

user.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['admin', 'viewer'],
      defaultValue: 'viewer',
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, tableName: 'users', timestamps: true },
);

user.hasOne(user_token, {
  foreignKey: 'userId',
  sourceKey: 'id',
  as: 'user_tokens',
});

user.hasOne(refresh_token, {
  foreignKey: 'userId',
  sourceKey: 'id',
  as: 'refresh_tokens',
});

user_token.belongsTo(user, {
  foreignKey: 'userId',
  as: 'users',
});

refresh_token.belongsTo(user, {
  foreignKey: 'userId',
  as: 'users',
});

export default user;
