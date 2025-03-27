import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { bannersAndmessagesService } from 'src/app/service/bannersAndmessages.service';

@Component({
  selector: 'app-addbanner-messages',
  templateUrl: './addbanner-messages.component.html',
  styleUrls: ['./addbanner-messages.component.css']
})
export class AddbannerMessagesComponent implements OnInit {
  imageSrc: any = [];
  myForm: FormGroup;
  messages : any;
  item_image: any[] = [];
  imageUrls: any[] = [];
  addStatus : boolean = false;
  editStatus : boolean = false;
  editId : any;
  allbannerAndmsg : any = [];
  constructor(public sanitizer: DomSanitizer,
    public addbannerAndmessages : bannersAndmessagesService,
    private toastr: ToastrService
    ) {
    this.myForm = new FormGroup({
      title: new FormControl('',),
    });

  }

  ngOnInit(): void {
    this.getAllbannerAndmessage()
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }
  get f(){
    return this.myForm.controls;
  }
  onFileChange(event:any) {
    let filesAmount = event.target.files;

    for (let file in Object.keys(filesAmount)) {
      console.log(filesAmount[file]);
      this.item_image = [...this.item_image, filesAmount[file]];
      this.imageUrls = [
        ...this.imageUrls,
        URL.createObjectURL(filesAmount[file]),
      ];
    }

  }

  addBannerAndmessage(){
  this.addStatus = true;
  this.editStatus =false;
  }

  editBannerAndmessage(banner : any)
  {
    this.editStatus =true;
    this.addStatus = false
    this.editId = banner.id;
    this.myForm.patchValue({ title: banner.title  });
  }

  Back(){
    this.getAllbannerAndmessage();
    this.addStatus = false;
    this.editStatus =false
  }

  delete(id : any){
    this.addbannerAndmessages.bannerDelete(id).subscribe((response : any)=>{
      if(response.success == 1){
        this.getAllbannerAndmessage();
        this.toastr.success(response.message);
      }else{
        this.toastr.error(response.message);
      }
          })
  }

  getAllbannerAndmessage(){
    this.addbannerAndmessages.getAllbannersMessages().subscribe((response : any)=>{
if(response.success == 1){
this.allbannerAndmsg = response.banners;
}else{

}
    })
  }

  submitMessage(){
    console.log("-----", this.messages, this.myForm.controls.title.value)
    const obj = {
     title : this.myForm.controls.title.value,
     banner : ''
    }
    if(this.addStatus)
    {
        this.addbannerAndmessages.addbannersAndmessages(obj).subscribe((response : any)=>{
    //  this.item_image = [];
    //  this.imageUrls = [];
        this.myForm.reset();
       })
    }
    else if (this.editStatus) {
       console.log("Write the code of API of Edit Here")
       this.addbannerAndmessages.editbannersAndmessages(this.editId, obj).subscribe((response : any)=>{
        //  this.item_image = [];
        //  this.imageUrls = [];
            this.myForm.reset();
           });
    }
    else {
        console.log("Do Nothing")
    }

  }

  submit(){
    console.log("-----", this.messages, this.myForm.controls.title.value)
    if(this.item_image.length == 0){
      this.toastr.error("Select banner");
      return;
    }
   const obj = {
    title : '',
    banner : this.item_image
   }
   if(this.addStatus)
   {
      this.addbannerAndmessages.addbannersAndmessages(obj).subscribe((response : any)=>{
      this.addStatus = false;
      this.editStatus =false;
      this.item_image = [];
      this.imageUrls = [];
    // this.myForm.reset();
     })
   }
   else if (this.editStatus) {
    this.addbannerAndmessages.editbannersAndmessages(this.editId,obj).subscribe((response : any)=>{
      this.addStatus = false;
      this.editStatus =false;
      this.item_image = [];
      this.imageUrls = [];
    // this.myForm.reset();
     });
    console.log("Write the code of API of Edit Here")
   }
  else {
      console.log("Do Nothing")
   }

  }
}
