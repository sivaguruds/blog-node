export declare type categories = {
  id?: string;
  name: string;
  description: string;
};

export declare type tags = {
  id?: string;
  name: string;
  description: string;
};

export declare type posts = {
  id?: string;
  title: string;
  subTitle: string;
  content: string;
  image: string;
  userId: string;
  categoryId: string;
  tags: string[];
};

export declare type postTags = {
  postId: any;
  tagId: string;
};
