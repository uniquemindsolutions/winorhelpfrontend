export interface User {
    id: number;
    username: string;
    user_id:string;
    room_id:string;
  }

  export interface Room {
    id: number;
    name: string;
    lotteryDate: Date;
    users: User[];
    manualWinners: User[];
    winners: User[];
    currentRound: number;
    scrolling: boolean;
    timeRemaining?: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
  }
