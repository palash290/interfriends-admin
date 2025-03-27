import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { UserService} from '../../../service/user.service';
import { UserListService} from '../../../service/userList.service';
import { UserList } from 'src/app/model/userList.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Output() valueChange = new EventEmitter();
  @Output()  change: EventEmitter < string > = new EventEmitter < string > ();

  user: UserList;
  imagePreview = 'assets/img/default-user-icon.jpg';

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public userListService: UserListService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      first_name: new FormControl(null, { validators: [Validators.required] }),
      last_name: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required] }),
      unique_id: new FormControl(null, { validators: [Validators.required] }),
      dob: new FormControl(null, { validators: [Validators.required] }),
      created_at: new FormControl(null, { validators: [Validators.required] }),
      mobile_number: new FormControl(null, { validators: [Validators.required] }),
      home_number: new FormControl(null, { validators: [Validators.required] }),
      emergency_number: new FormControl(null, { validators: [Validators.required] }),
      kin_name: new FormControl(null, { validators: [Validators.required] }),
      kin_number: new FormControl(null, { validators: [Validators.required] }),
      address_line_1: new FormControl(null, { validators: [Validators.required] }),
      address_line_2: new FormControl(null, { validators: [Validators.required] }),
      post_code: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] }),
      employement_type: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {})
    });
  }


  ngOnChanges(changes: { [property: string]: SimpleChange }): void {
    console.log("changes===========>", changes)
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
          this.userService.getUserInfo(this.mainId)
          .subscribe((response: any) => {
            this.user =  response.userinfo;
            this.form.patchValue({
              first_name: this.user.first_name,
              last_name: this.user.last_name,
              email: this.user.email,
              dob: this.user.dob,
              mobile_number: this.user.mobile_number,
              home_number: this.user.home_number,
              emergency_number: this.user.emergency_number,
              kin_name: this.user.kin_name,
              kin_number: this.user.kin_number,
              address_line_1: this.user.address_line_1,
              address_line_2: this.user.address_line_2,
              post_code: this.user.post_code,
              city: this.user.city,
              employement_type: this.user.employement_type,
              unique_id: this.user.	unique_id,
              created_at: this.user.created_at
            });
            this.isLoadingUpdate = false;
            this.imagePreview = this.user.profile_image;
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
      console.log("innnn", this.isLoading)
      this.userListService.addUser(
        this.form.value.first_name,
        this.form.value.last_name,
        this.form.value.email,
        this.form.value.dob,
        this.form.value.mobile_number,
        this.form.value.home_number,
        this.form.value.emergency_number,
        this.form.value.kin_name,
        this.form.value.kin_number,
        this.form.value.address_line_1,
        this.form.value.address_line_2,
        this.form.value.post_code,
        this.form.value.city,
        this.form.value.image,
        this.form.value.employement_type,
        this.form.value.unique_id,
        this.form.value.created_at
      ).subscribe((response: any) => {
        this.form.reset();
        this.imagePreview = 'assets/img/default-user-icon.jpg';
        document.getElementById('closePopupUser').click();
        this.isLoading = false;
        console.log("out", this.isLoading)

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
        this.user.user_id,
        this.form.value.first_name,
        this.form.value.last_name,
        this.form.value.email,
        this.form.value.dob,
        this.form.value.mobile_number,
        this.form.value.home_number,
        this.form.value.emergency_number,
        this.form.value.kin_name,
        this.form.value.kin_number,
        this.form.value.address_line_1,
        this.form.value.address_line_2,
        this.form.value.post_code,
        this.form.value.city,
        this.form.value.image,
        this.form.value.employement_type,
        this.form.value.unique_id,
        this.form.value.created_at
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
    this.change.emit("none")
  }

}
