import { Component, OnInit, OnChanges, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { UserService } from '../../../service/user.service';
import { UserListService } from '../../../service/userList.service';
import { UserList } from 'src/app/model/userList.model';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
declare const require: any;
const { PhoneNumberUtil } = require('google-libphonenumber');

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnChanges {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Output() valueChange = new EventEmitter();
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  subAdminId: any;

  user: UserList;
  imagePreview = 'assets/img/default-user-icon.jpg';
  id_proof_image = 'assets/img/blank.webp';
  preferredCountries: CountryISO[] = [CountryISO.UnitedKingdom, CountryISO.India, CountryISO.UnitedStates];
  searchCountryField = [SearchCountryField.Iso2, SearchCountryField.Name, SearchCountryField.DialCode];
  phoneNumberFormat = PhoneNumberFormat.International;
  mobileSelectedCountryISO = CountryISO.UnitedKingdom;
  homeSelectedCountryISO = CountryISO.UnitedKingdom;
  emergencySelectedCountryISO = CountryISO.UnitedKingdom;
  kinSelectedCountryISO = CountryISO.UnitedKingdom;
  private readonly phoneUtil = PhoneNumberUtil.getInstance();

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public userListService: UserListService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subAdminId = localStorage.getItem('userId_interFriendAdmin');
    this.mode = 'create';
    this.form = new FormGroup({
      first_name: new FormControl(null, { validators: [Validators.required] }),
      last_name: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      unique_id: new FormControl(null, { validators: [Validators.required] }),
      dob: new FormControl(null, { validators: [Validators.required] }),
      created_at: new FormControl(null, { validators: [Validators.required] }),
      mobile_number: new FormControl(null, { validators: [Validators.required] }),
      country_code: new FormControl('+44', { validators: [Validators.required] }),
      home_number: new FormControl(null, { validators: [Validators.required] }),
      home_country_code: new FormControl('+44', { validators: [Validators.required] }),
      emergency_number: new FormControl(null, { validators: [Validators.required] }),
      emergency_country_code: new FormControl('+44', { validators: [Validators.required] }),
      kin_name: new FormControl(null, { validators: [Validators.required] }),
      kin_number: new FormControl(null, { validators: [Validators.required] }),
      kin_country_code: new FormControl('+44', { validators: [Validators.required] }),
      address_line_1: new FormControl(null, { validators: [Validators.required] }),
      address_line_2: new FormControl(null, { validators: [Validators.required] }),
      post_code: new FormControl(null, { validators: [Validators.required] }),
      // country: new FormControl(null, { validators: [Validators.required] }),
      // state: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] }),
      employement_type: new FormControl('', { validators: [Validators.required] }),
      image: new FormControl(null, {}),
      id_proof_image: new FormControl(null, {})
    });

    this.applyPendingChanges();
  }


  ngOnChanges(changes: { [property: string]: SimpleChange }): void {
    this.applyPendingChanges(changes);
  }

  private applyPendingChanges(changes?: { [property: string]: SimpleChange }): void {
    const uniqueIdChange = changes?.['uniqueId'];
    const eachChange = changes?.['eachChange'];
    const addChange = changes?.['add'];

    if (uniqueIdChange?.currentValue !== undefined) {
      this.mainId = uniqueIdChange.currentValue;
    }

    if (eachChange?.currentValue !== undefined || (changes === undefined && this.eachChange !== undefined)) {
      if (!this.form) {
        return;
      }

      this.isLoadingUpdate = true;
      this.mode = 'update';
      this.userService.getUserInfo(this.mainId)
        .subscribe((response: any) => {
          this.user = response.userinfo;
          this.form.patchValue({
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            email: this.user.email,
            dob: this.user.dob,
            mobile_number: this.user.mobile_number,
            country_code: this.user.country_code ?? '+44',
            home_number: this.user.home_number,
            home_country_code: this.user.home_country_code ?? '+44',
            emergency_number: this.user.emergency_number,
            emergency_country_code: this.user.emergency_country_code ?? '+44',
            kin_name: this.user.kin_name,
            kin_number: this.user.kin_number,
            kin_country_code: this.user.kin_country_code ?? '+44',
            address_line_1: this.user.address_line_1,
            address_line_2: this.user.address_line_2,
            post_code: this.user.post_code,
            country: this.user.country,
            state: this.user.state,
            city: this.user.city,
            employement_type: this.user.employement_type,
            unique_id: this.user.unique_id,
            created_at: this.user.created_at
          });
          this.mobileSelectedCountryISO = this.resolveCountryISO(this.user.country_code);
          this.homeSelectedCountryISO = this.resolveCountryISO(this.user.home_country_code);
          this.emergencySelectedCountryISO = this.resolveCountryISO(this.user.emergency_country_code);
          this.kinSelectedCountryISO = this.resolveCountryISO(this.user.kin_country_code);
          this.isLoadingUpdate = false;
          this.imagePreview = this.user.profile_image;
          this.id_proof_image = this.user.id_proof_image;
        });
    }

    if (addChange?.currentValue !== undefined || (changes === undefined && this.add !== undefined)) {
      this.mode = 'create';
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

  onMobileCountryChange(country: any): void {
    this.form.patchValue({ country_code: `+${country?.dialCode ?? ''}` });
  }

  onHomeCountryChange(country: any): void {
    this.form.patchValue({ home_country_code: `+${country?.dialCode ?? ''}` });
  }

  onEmergencyCountryChange(country: any): void {
    this.form.patchValue({ emergency_country_code: `+${country?.dialCode ?? ''}` });
  }

  onKinCountryChange(country: any): void {
    this.form.patchValue({ kin_country_code: `+${country?.dialCode ?? ''}` });
  }

  private resolvePhoneValue(phoneField: any): string {
    if (!phoneField) {
      return '';
    }

    if (typeof phoneField === 'string') {
      return phoneField;
    }

    return phoneField.number || phoneField.nationalNumber || phoneField.e164Number || phoneField.internationalNumber || '';
  }

  private resolveCountryISO(dialCode: string | undefined): CountryISO {
    const code = (dialCode || '').replace(/[^0-9]/g, '');

    if (!code) {
      return CountryISO.UnitedKingdom;
    }

    const regionCode = this.phoneUtil.getRegionCodeForCountryCode(Number(code));
    if (!regionCode || regionCode === 'ZZ') {
      return CountryISO.UnitedKingdom;
    }

    const matchedISO = Object.values(CountryISO).find(
      (iso) => iso.toLowerCase() === regionCode.toLowerCase()
    );

    return (matchedISO as CountryISO) || CountryISO.UnitedKingdom;
  }

  onIdImagePicked(event: Event): any {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ id_proof_image: file });
    this.form.get('id_proof_image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.id_proof_image = reader.result as string;
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
      const mobileNumber = this.resolvePhoneValue(this.form.value.mobile_number);
      const homeNumber = this.resolvePhoneValue(this.form.value.home_number);
      const emergencyNumber = this.resolvePhoneValue(this.form.value.emergency_number);
      const kinNumber = this.resolvePhoneValue(this.form.value.kin_number);
      console.log("innnn", this.isLoading)
      this.userListService.addUser(
        this.form.value.first_name,
        this.form.value.last_name,
        this.form.value.email,
        this.form.value.dob,
        mobileNumber,
        this.form.value.country_code,
        homeNumber,
        this.form.value.home_country_code,
        emergencyNumber,
        this.form.value.emergency_country_code,
        this.form.value.kin_name,
        kinNumber,
        this.form.value.kin_country_code,
        this.form.value.address_line_1,
        this.form.value.address_line_2,
        this.form.value.post_code,
        this.form.value.country,
        this.form.value.state,
        this.form.value.city,
        this.form.value.image,
        this.form.value.id_proof_image,
        this.form.value.employement_type,
        this.form.value.unique_id,
        this.form.value.created_at,
        this.subAdminId
      ).subscribe((response: any) => {
        this.form.reset({
          country_code: '+44',
          home_country_code: '+44',
          emergency_country_code: '+44',
          kin_country_code: '+44'
        });
        this.mobileSelectedCountryISO = CountryISO.UnitedKingdom;
        this.homeSelectedCountryISO = CountryISO.UnitedKingdom;
        this.emergencySelectedCountryISO = CountryISO.UnitedKingdom;
        this.kinSelectedCountryISO = CountryISO.UnitedKingdom;
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
      const mobileNumber = this.resolvePhoneValue(this.form.value.mobile_number);
      const homeNumber = this.resolvePhoneValue(this.form.value.home_number);
      const emergencyNumber = this.resolvePhoneValue(this.form.value.emergency_number);
      const kinNumber = this.resolvePhoneValue(this.form.value.kin_number);
      this.userListService.editUser(
        this.user.user_id,
        this.form.value.first_name,
        this.form.value.last_name,
        this.form.value.email,
        this.form.value.dob,
        mobileNumber,
        this.form.value.country_code,
        homeNumber,
        this.form.value.home_country_code,
        emergencyNumber,
        this.form.value.emergency_country_code,
        this.form.value.kin_name,
        kinNumber,
        this.form.value.kin_country_code,
        this.form.value.address_line_1,
        this.form.value.address_line_2,
        this.form.value.post_code,
        this.form.value.country,
        this.form.value.state,
        this.form.value.city,
        this.form.value.image,
        this.form.value.id_proof_image,
        this.form.value.employement_type,
        this.form.value.unique_id,
        this.form.value.created_at,
        this.subAdminId
      ).subscribe((response: any) => {
        this.form.reset({
          country_code: '+44',
          home_country_code: '+44',
          emergency_country_code: '+44',
          kin_country_code: '+44'
        });
        this.mobileSelectedCountryISO = CountryISO.UnitedKingdom;
        this.homeSelectedCountryISO = CountryISO.UnitedKingdom;
        this.emergencySelectedCountryISO = CountryISO.UnitedKingdom;
        this.kinSelectedCountryISO = CountryISO.UnitedKingdom;
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
    this.form.reset({
      country_code: '+44',
      home_country_code: '+44',
      emergency_country_code: '+44',
      kin_country_code: '+44'
    });
    this.mobileSelectedCountryISO = CountryISO.UnitedKingdom;
    this.homeSelectedCountryISO = CountryISO.UnitedKingdom;
    this.emergencySelectedCountryISO = CountryISO.UnitedKingdom;
    this.kinSelectedCountryISO = CountryISO.UnitedKingdom;
    this.imagePreview = 'assets/img/default-user-icon.jpg';
    this.change.emit("none")
  }

}
