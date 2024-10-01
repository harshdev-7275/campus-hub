export type User = {
    id: string;
    googleId: string;
    email: string;
    name: string;
    username?: string;
    accessToken: string;
    college?: string;
    type?: string;
    location?: string;
    isVerified: boolean;
    createdAt: Date;
    userProfile?: UserProfile;
    posts: Post[];    // One-to-Many: User can have many posts
    likes: Like[];    // One-to-Many: User can like many posts
    comments: Comment[]; // One-to-Many: User can comment on many posts
  };
  
  export type UserProfile = {
    id: string;
    bio?: string;
    avatarUrl?: string;
    userId: string;
    user: User; // One-to-One: User has one UserProfile
  };
  
  export type Post = {
    id: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    college: string; // Posts are associated with a specific college
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    author: User; // Many-to-One: A post has one author (User)
    likes: Like[]; // One-to-Many: A post can have many likes
    comments: Comment[]; // One-to-Many: A post can have many comments
  };
  
  export type Like = {
    id: string;
    userId: string;
    user: User; // Many-to-One: A like is associated with one User
    postId: string;
    post: Post; // Many-to-One: A like is associated with one Post
  };
  
  export type Comment = {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    user: User; // Many-to-One: A comment is associated with one User
    postId: string;
    post: Post; // Many-to-One: A comment is associated with one Post
  };
  
  export type College = {
    id: string;
    name: string;
    type: string;
    location: string;
  };
