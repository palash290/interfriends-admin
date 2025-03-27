import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { creditscoreService } from 'src/app/service/creditscore.service';
@Component({
  selector: 'app-user-credit-score',
  templateUrl: './user-credit-score.component.html',
  styleUrls: ['./user-credit-score.component.css']
})
export class UserCreditScoreComponent implements OnInit {
  myForm: FormGroup;
  creditScoreList : any[] = [];
  editcreditscoreCheck : boolean = false;
  creditScoreId : any;
  addStatus : boolean = false;
  display : string = 'none';
  constructor(private getCreditScoreservice : creditscoreService) {
    this.myForm = new FormGroup({
      score1: new FormControl('',Validators.required),
      score2: new FormControl('',Validators.required),
      credit_score_name: new FormControl('',Validators.required),
      credit_score_description: new FormControl('',Validators.required),
    });
   }

  ngOnInit(): void {
this.getList();
  }

  Back(){
    this.editcreditscoreCheck = false;
    this.getList();
    this.addStatus = false;
  }

  addCreditScore(){
    this.addStatus = true;
    this.myForm.reset();
  }

  close(){
    this.editcreditscoreCheck = false;
    this.display = "none";
  }

  getList(){
    this.getCreditScoreservice.getCreditScore().subscribe((response : any)=>{

      if(response.success == "1"){
    this.creditScoreList = response.credit_score_list;
      }else{

      }
    })
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  editCreditScore(score : any){
this.editcreditscoreCheck = true;
this.creditScoreId = score.id;
this.display = "block";
this.myForm.patchValue({
      score1:score.score1,
      score2:score.score2,
      credit_score_name:score.credit_score_name,
      credit_score_description:score.credit_score_description
})
  }

  delete(id : any){
    this.getCreditScoreservice.deleteCreditScore(id).subscribe((response : any)=>{
      if(response.success == "1"){
        this.getList();
      }else{

      }
    })
  }

  updateCreditScore(){
    this.getCreditScoreservice.updateCreditScore(this.creditScoreId ,this.myForm.controls.score1.value, this.myForm.controls.score2.value,this.myForm.controls.credit_score_name.value,this.myForm.controls.credit_score_description.value).subscribe((response : any)=>{

      if(response.success == "1"){
        this.getList();
        this.myForm.reset();
        this.creditScoreId = '';
      }else{

      }
    })
  }

  submit(){
    this.getCreditScoreservice.addCreditScore(this.myForm.controls.score1.value, this.myForm.controls.score2.value,this.myForm.controls.credit_score_name.value,this.myForm.controls.credit_score_description.value).subscribe((response : any)=>{

      if(response.success == "1"){
        this.addStatus = false;
        this.getList();
        this.myForm.reset();
        this.creditScoreId = '';
      }else{

      }
    })
  }

}
