import { Component, OnInit, Input, SimpleChange, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  selectedGroupId: any = '0';

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

  }

  //passengers: [{ circle_name: 'test' }, { circle_name: 'second circle' }]

  ngOnChanges(changes: { [property: string]: SimpleChange }): void {
    this.selectedGroupId = '0';
    this.selectedCircles = [];
    this.form.patchValue({
      name: '',
      email: '',
      phone: ''
    });
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
        this.userListService.getUserInfo(this.mainId).subscribe((response: any) => {
          this.user = response.userinfo;

          this.form.patchValue({
            name: this.user.name,
            email: this.user.email,
            phone: this.user.phone
          });
          this.selectedGroupId = response.userinfo?.group_ids;
          this.getCircleList();
          this.isLoadingUpdate = false;

          // ---- pre-populate selected circles
          // response.userinfo.group_ids -> "5,12,22"
          const circle_ids = response.userinfo?.circle_ids
            ?.split(',')
            .filter((id: string) => id.trim() !== '');

          setTimeout(() => {
            // ciecleLists contains the available circles (from your dropdown)
            this.selectedCircles = this.ciecleLists
              .filter((seat: { id: { toString: () => any; }; }) => circle_ids.includes(seat.id.toString()))
              .map((seat: { id: any; circle_name: any; }) => ({
                id: seat.id,
                name: seat.circle_name
              }));
          }, 1000);
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

    if (this.form.invalid) {
      return;
    }

    // Collect circle ids from selectedCircles
    const circleIds = this.selectedCircles.map(c => c.id);

    this.isLoading = true;

    if (this.mode === 'create') {

      this.userListService.addUser(
        this.form.value.name,
        this.form.value.email,
        this.form.value.phone,
        this.selectedGroupId,
        circleIds
      ).subscribe((response: any) => {
        this.form.reset();
        this.imagePreview = 'assets/img/default-user-icon.jpg';
        document.getElementById('closePopupUser').click();
        this.isLoading = false;

        if (response.success === '1') {
          this.valueChange.emit('add');
          this.toastr.success(response.message);
          this.selectedCircles = [];
        } else {
          this.toastr.error(response.message);
        }
      });

    } else {
      // update
      this.userListService.editUser(
        this.user.id,
        this.form.value.name,
        this.form.value.email,
        this.form.value.phone,
        this.selectedGroupId,
        circleIds
      ).subscribe((response: any) => {
        this.form.reset();
        this.imagePreview = 'assets/img/default-user-icon.jpg';
        document.getElementById('closePopupUser').click();
        this.isLoading = false;

        if (response.success == '1') {
          this.valueChange.emit('update');
          this.toastr.success(response.message);
          this.selectedCircles = [];
          this.selectedGroupId = '0'
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
  //selectedSeats: any[] = [];
  selectedCircleIds: any[] = [];
  seatOptions: number[] = [];
  selectedCircles: { id: string, name: string }[] = [];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleSeatSelection(name: string, id: string): void {
    const exists = this.selectedCircles.find(sc => sc.id === id);

    if (exists) {
      // remove
      this.selectedCircles = this.selectedCircles.filter(sc => sc.id !== id);
    } else {
      // add
      this.selectedCircles.push({ id, name });
    }

    console.log('Selected Circles:', this.selectedCircles);
  }

  // removeSeat(event: Event, seat: number) {

  //   event.stopPropagation(); // Prevents dropdown toggle
  //   this.selectedSeats = this.selectedSeats.filter(s => s !== seat);

  //   // Check if the seat is already in seatOptions before pushing
  //   if (!this.seatOptions.includes(seat)) {
  //     this.seatOptions.push(seat);
  //     this.seatOptions.sort((a, b) => a - b); // Optional: Sort if needed
  //   }
  // }

  removeSeat(event: Event, circle: { id: string, name: string }): void {
    event.stopPropagation();

    this.selectedCircles = this.selectedCircles.filter(sc => sc.id !== circle.id);
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

  onGroupChange(id: string): void {
    this.selectedGroupId = id;        // or remove this line and use selectedGroupId directly
    this.getCircleList();
  }

  ciecleLists: any;

  getCircleList() {
    const formData = new FormData();
    formData.append('group_id', this.selectedGroupId);   // <– you could also use this.selectedGroupId

    this.groupService.postAPI('/getCircleBygroupid', formData).subscribe({
      next: (res: any) => {
        if (res.success == 1) {
          this.isLoading = false;
          this.ciecleLists = res.data;
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  isSelected(id: string): boolean {
    return this.selectedCircles.some(sc => sc.id === id);
  }


}
