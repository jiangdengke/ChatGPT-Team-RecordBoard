export interface Member {
  id: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  ownerEmail: string; // 母号
  members: Member[];
}

export interface Data {
  teams: Team[];
}