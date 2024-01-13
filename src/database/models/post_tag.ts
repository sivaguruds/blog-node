import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class post_tag extends Model<InferAttributes<post_tag>, InferCreationAttributes<post_tag>> {
  declare postId: string;
  declare tagId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

post_tag.init(
  {
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tagId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, tableName: 'post_tags', timestamps: true },
);

export default post_tag;
