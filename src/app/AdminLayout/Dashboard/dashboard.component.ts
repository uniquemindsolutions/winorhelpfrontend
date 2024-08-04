import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router:Router,) { 
  
  }

  ngOnInit() {
    
  
    const userid=localStorage.getItem('user_id');
   
    if (localStorage.getItem('user_id') == '' || localStorage.getItem('user_id')==null) {
      this.router.navigate(['/home']);
    }
  }

}
