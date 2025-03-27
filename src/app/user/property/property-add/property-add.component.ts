import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { FileHandle } from '../../../directive/image-drag.directive';
import { PropertyService} from '../../../service/property.service';
import { Property } from 'src/app/model/property.model';
import { ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-property-add',
  templateUrl: './property-add.component.html',
  styleUrls: ['./property-add.component.css']
})
export class PropertyAddComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  property: Property;
  imagePreview = 'assets/img/default-user-icon.jpg';
  backgroundImage:  {
    property_image_id: string;
    background_image: string;
    property_id: string;
} [] = [];

  // image code start
  fileUploads:any  []  =  [];
  filesPreview:any  []  =  [];
  files: FileHandle[] = [];

  constructor(
    public authService: AuthService,
    public propertyService: PropertyService,
    private toastr: ToastrService,
    private router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      short_description: new FormControl(null, { validators: [Validators.required, Validators.minLength(2),
        Validators.maxLength(70)] }),
      long_description: new FormControl(null, { validators: [Validators.required, Validators.minLength(2),
        Validators.maxLength(100)] }),
      main_amount: new FormControl(null, { validators: [Validators.required] }),
      start_date: new FormControl(null, { validators: [Validators.required] }),
      property_tenure: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {})
    });

    this.setAddEditForm();
  }

  setAddEditForm() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.mainId = paramMap.get('propertyId');
      console.log(this.mainId, 'this.mainId');
      if(this.mainId) {
        console.log(this.mainId, 'this. after')
        this.isLoadingUpdate = true;
        this.mode = 'update';
        this.propertyService.property_detail(this.mainId)
        .subscribe((response: any) => {
          this.property =  response.propertyDetail;
          this.form.patchValue({
            title: this.property.title,
            short_description: this.property.short_description,
            long_description: this.property.long_description,
            main_amount: this.property.main_amount,
            start_date: this.property.start_date,
            property_tenure: this.property.property_tenure
          });

          this.backgroundImage = this.property.background_image;
          this.imagePreview = this.property.property_image_thumb;
          this.isLoadingUpdate = false;
        });
      } else {
        this.mode = 'create';
        console.log(this.mainId, 'this before')
      }
    });
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


  onImagePicked(event: Event): any {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


   // image code start

   onImagePickedMultiple(event: any): any {
    for  (var i =  0; i <  event.target.files.length; i++)  {
      this.fileUploads.push(event.target.files[i]);

      const reader = new FileReader();
      reader.onload = () => {
        this.filesPreview.push(reader.result as string);
      };
      reader.readAsDataURL(event.target.files[i]);
    }
  }

  onRemoveImage(index: number) {
    this.fileUploads.splice(index, 1);
    this.filesPreview.splice(index, 1);
  }


  filesDropped($event: any): void {
    this.files = $event;
    console.log(this.files);

    for  (var i =  0; i < this.files.length; i++)  {
        console.log(this.files[i].file);
        this.fileUploads.push(this.files[i].file);
        this.filesPreview.push(this.files[i].url);
        console.log(this.files[i].url);
    }
  }

   // image code end


  deleteImage(id: string, index: number) {
    this.propertyService.deletePropertyImage(id).subscribe((response: any) => {
      if(response.success === '1') {
        this.toastr.success(response.message);
        this.backgroundImage.splice(index, 1);
      } else {
        this.toastr.error(response.message);
      }
    });
  }


  onSave(): void {
    this.form.markAllAsTouched();
    console.log(this.form.invalid);
    console.log(this.form);

    if (this.mode === 'create') {

      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;

      this.propertyService.addProperty(
        this.form.value.title,
        this.form.value.short_description,
        this.form.value.long_description,
        this.form.value.main_amount,
        this.form.value.start_date,
        this.form.value.property_tenure,
        this.form.value.image,
        this.fileUploads
      ).subscribe((response: any) => {
        this.form.reset();
        this.imagePreview = 'assets/img/default-user-icon.jpg';
        this.isLoading = false;

        if (response.success === '1') {
          this.toastr.success(response.message);
          this.router.navigate(['/user/propertyList']);
        } else {
          this.toastr.error(response.message);
          this.router.navigate(['/user/propertyList']);
        }
      });
    } else {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      this.propertyService.editProperty(
        this.property.id,
        this.form.value.title,
        this.form.value.short_description,
        this.form.value.long_description,
        this.form.value.main_amount,
        this.form.value.start_date,
        this.form.value.property_tenure,
        this.form.value.image,
        this.fileUploads
      ).subscribe((response: any) => {
        this.form.reset();
        this.imagePreview = 'assets/img/default-user-icon.jpg';
        this.isLoading = false;
        if (response.success === '1') {
          this.toastr.success(response.message);
          this.router.navigate(['/user/propertyList']);
        } else {
          this.toastr.error(response.message);
          this.router.navigate(['/user/propertyList']);
        }
      });
    }
  }
}
