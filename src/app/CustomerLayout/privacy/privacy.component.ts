import { Component } from '@angular/core';
import { AdminService } from '../../Services/Admin.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [],
  providers:[AdminService],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {

  dataSource:any;
  htmlContent:any;

  constructor(private api:AdminService,private sanitizer: DomSanitizer) {
  }


  ngOnInit(){
    this.getprivacy();
   }
  
  
  getprivacy(){
    this.api.getPrivacy().subscribe({
      next:(res:any) => {
        console.log(res.data[0].content, 'resultTerms');
        this.dataSource=res.data[0].content;
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.dataSource);
      },
      error: (err: any) => {
  
      }
    })
   }

}
