import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  private messageSubject = new Subject<any>();

  constructor() {
    this.socket = new WebSocket('ws://localhost:8082');
    this.socket.onmessage = (event) => {
      this.messageSubject.next(JSON.parse(event.data));
    };
  }

  // public connect(): void {
  //   this.socket$ = webSocket('ws://localhost:8082'); // Replace with your WebSocket server URL
  // }

  // public sendMessage(message: any): void {
  //   this.socket$.next(message);
  // }

  // public onMessage(): any {
  //   return this.socket$.asObservable();
  // }

  // public closeConnection(): void {
  //   this.socket$.complete();
  // }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: any): void {
    this.socket.send(JSON.stringify(message));
  }
}
