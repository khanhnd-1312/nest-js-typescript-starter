export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
}
