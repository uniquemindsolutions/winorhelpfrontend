import { Component } from '@angular/core';
import { AdminService } from '../../Services/Admin.service';
import { AuthService } from '../../Services/Auth.service';
import { DomSanitizer } from '@angular/platform-browser';
// import * as DOMPurify from 'dompurify';


@Component({
  selector: 'app-termscond',
  standalone: true,
  imports: [],
  providers:[AdminService],
  templateUrl: './termscond.component.html',
  styleUrl: './termscond.component.css'
})
export class TermscondComponent {

  dataSource:any;
  htmlContent:any;
  

  constructor(private api:AdminService,private sanitizer: DomSanitizer) {
  }

  ngOnInit(){
    this.gettermsCondition();
   }

  gettermsCondition(){
    this.api.getTerms().subscribe({
      next:(res:any) => {
        console.log(res.data[0].content, 'resultTerms');
        
         this.dataSource=res.data[0].content;
         this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.dataSource);

      //    const cleanHtml = DOMPurify.sanitize(res.data[0].content);
      // this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(cleanHtml);

      },
      error: (err: any) => {
  
      }
    })
   }
}
