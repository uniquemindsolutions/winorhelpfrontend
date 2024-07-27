export interface User {
    user_id: number;
    username: string;
  }
  
  export interface Room {
    id: number;
    name: string;
    latter_datetime:any;
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
  