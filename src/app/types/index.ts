export interface UserModel {
  id: number;
  fullName: string;
  email: string;
  password: string;
}
export interface PostModel {
  id: number;
  title: string;
  user: UserModel;
  createdAt: string;
  content: string;
}
