export interface Game {
  created_at: string;
}

export type RoomMember = {
  id: string;
  isWhite: boolean;
}[];

export type StartGameData = {
  roomId: string;
  members: RoomMember;
};
