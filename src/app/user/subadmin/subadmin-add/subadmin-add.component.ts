import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { SubadminListService} from '../../../service/subadminList.service';
import { Subadmin } from 'src/app/model/subadmin.model';

@Component({
  selector: 'app-subadmin-add',
  templateUrl: './subadmin-add.component.html',
  styleUrls: ['./subadmin-add.component.css']
})
export class SubadminAddComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Output() valueChange = new EventEmitter();
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();
  user: Subadmin;
  imagePreview = 'assets/img/default-user-icon.jpg';

  constructor(
    public authService: AuthService,
    public userListService: SubadminListService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required] }),
      phone: new FormControl(null, { validators: [Validators.required] })
    });
  }


  ngOnChanges(changes: { [property: string]: SimpleChange }): void {
    if (changes['uniqueId'] !== undefined || changes['eachChange'] !== undefined) {
      if (changes['eachChange'].currentValue !== undefined) {
          if (changes['uniqueId'] === undefined) {
            this.mainId = this.mainId;
          } else if (changes['uniqueId'].currentValue !== undefined) {
            this.mainId = changes['uniqueId'].currentValue;
          } else {
            this.mainId = this.mainId;
          }

          this.isLoadingUpdate = true;
          this.mode = 'update';
          this.userListService.getUserInfo(this.mainId)
          .subscribe((response: any) => {
            this.user =  response.userinfo;
            this.form.patchValue({
              name: this.user.name,
              email: this.user.email,
              phone: this.user.phone
            });
            this.isLoadingUpdate = false;
            // this.imagePreview = this.user.profile_image;
          });
      }
    }



    if (changes['add'] !== undefined) {
          if (changes['add'].currentValue !== undefined) {
            this.mode = 'create';
          }
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


  onSave(): void {
    this.form.markAllAsTouched();
    console.log(this.form.invalid);
    console.log(this.form.value.dob, 'dob');

    if (this.mode === 'create') {

      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;

      this.userListService.addUser(
        this.form.value.name,
        this.form.value.email,
        this.form.value.phone
      ).subscribe((response: any) => {
        this.form.reset();
        this.imagePreview = 'assets/img/default-user-icon.jpg';
        document.getElementById('closePopupUser').click();
        this.isLoading = false;


        if (response.success === '1') {
          this.valueChange.emit('add');
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      });
    } else {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      this.userListService.editUser(
        this.user.id,
        this.form.value.name,
        this.form.value.email,
        this.form.value.phone
      ).subscribe((response: any) => {
        this.form.reset();
        this.imagePreview = 'assets/img/default-user-icon.jpg';
        document.getElementById('closePopupUser').click();
        this.isLoading = false;
        if (response.success === '1') {
          this.valueChange.emit('update');
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      });
    }
  }


  onClose(): void {
    this.form.reset();
    this.imagePreview = 'assets/img/default-user-icon.jpg';
    this.closeModal.emit("none")
  }

}
