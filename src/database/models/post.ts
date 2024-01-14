import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import post_like from './post_like';
import post_tag from './post_tag';
import tag_new from './tag_new';

export class post extends Model<InferAttributes<post>, InferCreationAttributes<post>> {
  declare id: CreationOptional<number>;
  declare userId: string;
  declare title: string;
  declare subTitle: string;
  declare content: string;
  declare image: string;
  declare categoryId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

post.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'user',
        key: 'id',
      },
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: 'category',
        key: 'id',
      },
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, tableName: 'posts', timestamps: true },
);

// Many-to-Many associations(post to tag)
post.belongsToMany(tag_new, {
  through: post_tag,
  as: 'tag_news',
  foreignKey: 'postId',
});

// belongsTo associations(tag to post)
tag_new.belongsToMany(post, {
  through: post_tag,
  as: 'posts',
  foreignKey: 'tagId',
});

post.hasMany(post_like, {
  foreignKey: 'postId',
  as: 'post_likes',
  sourceKey: 'id',
});

post_like.belongsTo(post, {
  foreignKey: 'postId',
  as: 'posts',
});

export default post;
