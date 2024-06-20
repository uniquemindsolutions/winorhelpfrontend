import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Room, User } from '../room.model';





@Component({
  selector: 'app-timergame',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule],
  templateUrl: './timergame.component.html',
  styleUrl: './timergame.component.css'
})
export class TimergameComponent  {
  private countdownSubscription: Subscription | undefined;
  private scrollSubscription: Subscription | undefined;
  public readonly roundDuration = 60000; // 1 minute per round

  room: Room = { 
    id: 1, 
    name: 'Room 1', 
    lotteryDate: new Date(new Date().getTime() + this.roundDuration), 
    users: [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' },
      { id: 4, name: 'User 4' },
      { id: 5, name: 'User 5' },
      { id: 6, name: 'User 6' }
    ],
    manualWinners: [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' },
      { id: 4, name: 'User 4' }
    ],
    winners: [],
    currentRound: 0,
    scrolling: true
  };

  currentScrollingUserIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.startCountdown();
    this.startScrolling();
  }

  startCountdown(): void {
    this.updateCountdown();
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  startScrolling(): void {
    this.scrollSubscription = interval(2000).subscribe(() => {
      if (this.room.scrolling) {
        this.scrollToNextUser();
      }
    });
  }

  scrollToNextUser(): void {
    this.currentScrollingUserIndex = (this.currentScrollingUserIndex + 1) % this.room.users.length;
  }

  updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.room.lotteryDate.getTime() - now;

    if (distance < 0) {
      if (this.room.currentRound < 4) {
        this.selectWinnerForRound();
        this.room.currentRound += 1;
        if (this.room.currentRound < 4) {
          this.room.lotteryDate = new Date(new Date().getTime() + this.roundDuration);
          this.room.scrolling = true;
        }
      }
      this.room.timeRemaining = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    } else {
      this.room.timeRemaining = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    }
  }

  selectWinnerForRound(): void {
    let winner: User;
    if (this.room.manualWinners && this.room.manualWinners.length > this.room.currentRound) {
      winner = this.room.manualWinners[this.room.currentRound];
    } else {
      winner = this.selectAutomaticWinner();
    }
    
    if (winner) {
      this.room.winners.push(winner);
      this.room.scrolling = false;
    }
  }

  selectAutomaticWinner(): User {
    const remainingUsers = this.room.users.filter(user => !this.room.winners.includes(user));
    if (remainingUsers.length === 0) {
      console.error('No remaining users to select from.');
      return this.room.users[0];
    }
    const randomIndex = Math.floor(Math.random() * remainingUsers.length);
    return remainingUsers[randomIndex];
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  getPreviousUserIndex(index: number): number {
    return (index - 1 + this.room.users.length) % this.room.users.length;
  }

  getNextUserIndex(index: number): number {
    return (index + 1) % this.room.users.length;
  }
}