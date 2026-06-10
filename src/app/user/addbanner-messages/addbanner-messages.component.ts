import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  messages: any;
  item_image: any[] = [];
  imageUrls: any[] = [];
  addStatus: boolean = false;
  editStatus: boolean = false;
  editId: any;
  allbannerAndmsg: any = [];
  isLoading = false;
  constructor(public sanitizer: DomSanitizer,
    public addbannerAndmessages: bannersAndmessagesService,
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
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  get f() {
    return this.myForm.controls;
  }

  // onFileChange(event: any) {
  //   const files = event.target.files;

  //   // Reset arrays to replace previous image(s)
  //   this.item_image = [];
  //   this.imageUrls = [];

  //   for (let i = 0; i < files.length; i++) {
  //     if (!this.isImageOrVideo(files[i])) {
  //       this.toastr.error("Only image and video files are allowed");
  //       event.target.value = '';
  //       this.item_image = [];
  //       this.imageUrls = [];
  //       return;
  //     }
  //     this.item_image.push(files[i]);
  //     this.imageUrls.push({
  //       url: URL.createObjectURL(files[i]),
  //       type: files[i].type
  //     });
  //   }
  // }

  onFileChange(event: any) {
    const files = event.target.files;

    // Reset arrays to replace previous image(s)
    this.item_image = [];
    this.imageUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Type validation
      if (!this.isImageOrVideo(file)) {
        this.toastr.error("Only image and video files are allowed");
        event.target.value = '';
        this.item_image = [];
        this.imageUrls = [];
        return;
      }

      // Size validation
      if (file.type.startsWith('image/')) {
        const maxImageSize = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxImageSize) {
          this.toastr.error("Image size must not exceed 5 MB");
          event.target.value = '';
          this.item_image = [];
          this.imageUrls = [];
          return;
        }
      }

      if (file.type.startsWith('video/')) {
        const maxVideoSize = 20 * 1024 * 1024; // 20 MB
        if (file.size > maxVideoSize) {
          this.toastr.error("Video size must not exceed 20 MB");
          event.target.value = '';
          this.item_image = [];
          this.imageUrls = [];
          return;
        }
      }

      this.item_image.push(file);
      this.imageUrls.push({
        url: URL.createObjectURL(file),
        type: file.type
      });
    }
  }

  isImageOrVideo(file: File) {
    return file.type.startsWith('image/') || file.type.startsWith('video/');
  }


  addBannerAndmessage() {
    this.addStatus = true;
    this.editStatus = false;
  }

  editBannerAndmessage(banner: any) {
    this.editStatus = true;
    this.addStatus = false
    this.editId = banner.id;
    //this.myForm.patchValue({ title: banner.title });
    this.getBannerDetail();
  }

  Back() {
    this.getAllbannerAndmessage();
    this.addStatus = false;
    this.editStatus = false
  }

  delete(id: any) {
    this.addbannerAndmessages.bannerDelete(id).subscribe((response: any) => {
      if (response.success == 1) {
        this.getAllbannerAndmessage();
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    })
  }

  getAllbannerAndmessage() {
    this.addbannerAndmessages.getAllbannersMessages().subscribe((response: any) => {
      if (response.success == 1) {
        this.allbannerAndmsg = response.banners;
      } else {

      }
    })
  }

  editImg: any;

  getBannerDetail() {
    this.addbannerAndmessages.getBannerDetail(this.editId).subscribe((response: any) => {
      if (response.success == 1) {
        this.myForm.patchValue({ title: response?.banner?.title });
        this.editImg = response?.banner?.image
      } else {

      }
    })
  }

  submitMessage() {
    const currPassword = this.myForm.controls.title.value?.trim();

    if (!currPassword) {
      return;
    }
    console.log("-----", this.messages, this.myForm.controls.title.value)
    const obj = {
      title: this.myForm.controls.title.value,
      banner: ''
    }
    if (this.addStatus) {
      this.addbannerAndmessages.addbannersAndmessages(obj).subscribe((response: any) => {
        this.myForm.reset();
      })
    }
    else if (this.editStatus) {
      console.log("Write the code of API of Edit Here")
      this.addbannerAndmessages.editbannersAndmessages(this.editId, obj).subscribe((response: any) => {
        this.myForm.reset();
      });
    }
    else {
      console.log("Do Nothing")
    }

  }

  isVideo(url: string): boolean {
    if (!url) return false;

    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  submit() {
    // const currPassword = this.myForm.controls.title.value?.trim();

    // if (!currPassword) {
    //   return;
    // }
    //debugger
    if (this.item_image.length == 0 && this.addStatus == true) {
      this.toastr.error("Select banner");
      return;
    }
    const obj = {
      title: this.myForm.controls.title.value,
      banner: this.item_image
    }
    this.isLoading = true;
    if (this.addStatus) {
      this.addbannerAndmessages.addbannersAndmessages(obj).subscribe((response: any) => {
        this.addStatus = false;
        this.editStatus = false;
        this.item_image = [];
        this.imageUrls = [];
        // this.myForm.reset();
        this.getAllbannerAndmessage();
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
      })
    }
    else if (this.editStatus) {
      this.addbannerAndmessages.editbannersAndmessages(this.editId, obj).subscribe((response: any) => {
        this.addStatus = false;
        this.editStatus = false;
        this.item_image = [];
        this.imageUrls = [];
        // this.myForm.reset();
        this.getAllbannerAndmessage();
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
      });
      console.log("Write the code of API of Edit Here")
    }
    else {
      console.log("Do Nothing");
      this.isLoading = false;
    }

  }


}
