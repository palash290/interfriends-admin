import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { SubadminListService } from '../../../service/subadminList.service';
import { Subadmin } from 'src/app/model/subadmin.model';
import { GroupService } from 'src/app/service/group.service';
import { Group } from 'src/app/model/group.model';
import { Subscription } from 'rxjs';

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
  @Output() closeModal: EventEmitter<string> = new EventEmitter<string>();
  user: Subadmin;
  imagePreview = 'assets/img/default-user-icon.jpg';
  lists: Group[] = [];
  listsPerPage = 10;
  currentPage = 0;
  private listsSub: Subscription;
  totalLists = 0;

  constructor(
    public authService: AuthService,
    public userListService: SubadminListService,
    private toastr: ToastrService,
    private router: Router,
    public groupService: GroupService,
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required] }),
      phone: new FormControl(null, { validators: [Validators.required] })
    });
    this.groupService.getLists(this.listsPerPage, this.currentPage);

    this.listsSub = this.groupService.getListUpdateListener().subscribe(
      (listData: { lists: Group[]; listCount: number }) => {
        this.lists = listData.lists;
        this.totalLists = listData.listCount;
        this.isLoading = false;
      });


    // this.userListService.getUserInfo(this.mainId)
    //   .subscribe((response: any) => {
    //     this.user = response.userinfo;
    //     debugger
    //     this.selectedSeats = response.userinfo.group_ids
    //       .filter((p: { group_cycle_name: any }) => p.group_cycle_name !== null)
    //       .map((p: { group_cycle_name: any }) => p.group_cycle_name);
    //   });

  }

  //passengers: [{ circle_name: 'test' }, { circle_name: 'second circle' }]

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
            this.user = response.userinfo;
            this.form.patchValue({
              name: this.user.name,
              email: this.user.email,
              phone: this.user.phone
            });
            this.isLoadingUpdate = false;

            // this.imagePreview = this.user.profile_image;
const groupIds = response.userinfo?.group_ids
  ?.split(',')
  .filter((id: string) => id.trim() !== '');

this.selectedSeats = this.lists
  .filter(seat => groupIds.includes(seat.id.toString()))
  .map(seat => seat.group_cycle_name);


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
        this.form.value.phone,
        this.selectedCircleIds
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
        this.form.value.phone,
        this.selectedCircleIds
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


  dropdownOpen = false;
  selectedSeats: any[] = [];
  selectedCircleIds: number[] = [];
  seatOptions: number[] = [];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleSeatSelection(seat: any, id: any) {
    //debugger
    if (this.selectedSeats.includes(seat)) {
      // Remove the seat if it's already selected
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat);
      this.selectedCircleIds = this.selectedSeats.filter(i => i !== id);
    } else {
      // Add the seat if it's not already selected and there's room
      this.selectedSeats.push(seat);
      this.selectedCircleIds.push(id);
      // Sort in ascending order
      this.selectedSeats.sort((a, b) => a - b);
    }
  }

  removeSeat(event: Event, seat: number) {
    event.stopPropagation(); // Prevents dropdown toggle
    this.selectedSeats = this.selectedSeats.filter(s => s !== seat);

    // Check if the seat is already in seatOptions before pushing
    if (!this.seatOptions.includes(seat)) {
      this.seatOptions.push(seat);
      this.seatOptions.sort((a, b) => a - b); // Optional: Sort if needed
    }
  }

  // for close seat dropdown
  @ViewChild('dropdown') dropdownRef!: ElementRef;

  @HostListener('document:click', ['$event'])

  handleClickOutside(event: MouseEvent) {
    if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
  // end //


}
