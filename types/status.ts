export interface User {
  _id: string;
  username: string;
}

export interface Status {
  _id: string;
  user: User;
  mediaUrl: string;
  mediaType: "image" | "video"; 
  expiresAt: string; 
  createdAt: string;
  updatedAt: string; 
  __v: number;
}

export interface GroupedStatuses {
  user: User;
  statuses: Status[];
}
