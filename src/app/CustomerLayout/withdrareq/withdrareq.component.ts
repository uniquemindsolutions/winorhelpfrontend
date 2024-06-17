import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomeServiceService } from '../../Services/custome-service.service';

@Component({
  selector: 'app-withdrareq',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule],
  templateUrl: './withdrareq.component.html',
  styleUrl: './withdrareq.component.css'
})
export class WithdrareqComponent {

  withdraw!: FormGroup;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private customeservice:CustomeServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    localStorage.setItem("loginsession", "false");
    this.withdraw = this.formBuilder.group({
      amount: ['', [Validators.required]],
    });
  }

  get f() {
    return this.withdraw.controls;
  }


  onSubmit(): void {
    this.submitted = true;
    if (this.withdraw.valid) {
      
      console.log("formvalues",this.withdraw.value)
      const data={"amount":this.withdraw.value};
     

      this.customeservice.debitWalletamount(data).subscribe({
        next: (result:any) => {
          console.log("resultval",result);
          this.router.navigate(['/mytransaction']);
        },
        error: (err: any) => {

        }
      })
    } else {
      console.log('Form is not valid');
    }

      
    }
  

}
