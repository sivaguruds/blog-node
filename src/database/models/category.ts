import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import post from './post';

export class category extends Model<InferAttributes<category>, InferCreationAttributes<category>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

category.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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
  { sequelize, tableName: 'categories', timestamps: true },
);

category.hasMany(post, {
  foreignKey: 'categoryId',
  sourceKey: 'id',
  as: 'posts',
});

post.belongsTo(category, {
  foreignKey: 'categoryId',
  as: 'categories',
});

export default category;
