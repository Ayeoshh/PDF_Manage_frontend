export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface PDF {
  id: string;
  name: string;
  originalname: string;
  size: number;
  shareableLink: string;
  createdAt: string;
  ownerId: string;
  shared: boolean;
  url: string;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  pdfId: string;
  parentId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}