import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { GroupService} from '../../../service/group.service';
import { Group } from 'src/app/model/group.model';
import { UserService } from 'src/app/service/user.service';
import { AllUser } from 'src/app/model/allUser.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css']
})
export class GroupAddComponent implements OnInit {

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
  group: Group;
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(
    public authService: AuthService,
    public groupService: GroupService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router,
  
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      group_cycle_name: new FormControl(null, { validators: [Validators.required] }),
      group_cycle_descp	: new FormControl(null, { validators: [Validators.required] })
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
          this.groupService.group_detail(this.mainId)
          .subscribe((response: any) => {
            this.group =  response.groupDetail;
            this.form.patchValue({
              group_cycle_name: this.group.group_cycle_name,
              group_cycle_descp: this.group.group_cycle_descp
            });
            this.isLoadingUpdate = false;
          });
      }
    }



    if (changes['add'] !== undefined) {
          if (changes['add'].currentValue !== undefined) {
            this.mode = 'create';
          }
    }

  }

  onSave(): void {
    this.form.markAllAsTouched();
    // console.log(this.form.invalid);
    console.log(this.form.value.members, 'selectedItems');

    if (this.mode === 'create') {

      if (this.form.invalid) {
        return;
      }

      this.isLoading = true;

      this.groupService.addGroup(
        this.form.value.group_cycle_name,
        this.form.value.group_cycle_descp
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopup').click();
        this.isLoading = false;


        if (response.success === '1') {
          // this.valueChange.emit('add');
          this.router.navigate(['/user/UserGroupAddList',response.group_id]);
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
      this.groupService.editGroup(
        this.group.id,
        this.form.value.group_cycle_name,
        this.form.value.group_cycle_descp
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopup').click();
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



  onItemSelect(item:any){

  }

  OnItemDeSelect(item:any){

  }


  onClose(): void {
    this.form.reset();
    this.closeModal.emit("none")
  }

}
