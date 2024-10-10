import container from "../../container";
import { QueryResult } from "pg";

const {
  user,
  comment,
  post,
  createPost,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
  deletePost,
  searchAndFilterPosts,
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  searchAndFilterUsers,
  signIn,
  userRepository,
  postRepository,
  psqlClient,
  appConfig,
} = container.cradle;

export type Table = typeof user | typeof comment | typeof post;
export type ShutdownFunction = () => Promise<void>;

export interface User {
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  password: string;
}

export interface Post {
  post: string;
  userId?: string;
}

export interface Comment {
  comment: string;
  userId?: string;
  postId?: string;
}

export interface Auth {
  email: string;
  password: string;
}
export interface IPost extends Post {
  execute(payload?: Post | Comment | string): Promise<QueryResult[]>;
}

export interface IQueryOptions {
  selectedColumns?: string[];
  excludedColumns?: string[];
  include?: Array<Table>;
  clause?: object;
  page?: number;
  limit?: number;
}

export interface IUserUsecase {
  userRepository: typeof userRepository;
  config: typeof appConfig;
  psqlClient?: typeof psqlClient;
  Post?: typeof post;
}

export interface IPostUsecase {
  postRepository: typeof postRepository;
  config: typeof appConfig;
  psqlClient?: typeof psqlClient;
}

export interface IUserController {
  createUser: typeof createUser;
  getUser: typeof getUser;
  updateUser: typeof updateUser;
  deleteUser: typeof deleteUser;
  getUsers: typeof getUsers;
  signIn: typeof signIn;
  searchAndFilterUsers: typeof searchAndFilterUsers;
}

export interface IPostController {
  createPost: typeof createPost;
  getUserPosts: typeof getUserPosts;
  getPosts: typeof getPosts;
  getPost: typeof getPost;
  updatePost: typeof updatePost;
  deletePost: typeof deletePost;
  searchAndFilterPosts: typeof searchAndFilterPosts;
}
interface Error {
  name: string;
  details: object;
}
export interface IError extends Error {
  status?: number;
  error?: Error;
  errors?: object;
  data?: object;
  message?: string;
}

export interface IUser extends User {
  execute(payload?: User | string): Promise<QueryResult[]>;
}

export interface IUserQueryOptions {
  gender?: string;
  name?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface IPostQueryOptions {
  keyword?: string | object;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface Auth {
  email: string;
  password: string;
}

export interface Comment {
  comment: string;
  userId?: string;
  postId?: string;
}
