import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { GroupCycleService} from '../../../service/groupCycle.service';
import { UserService } from 'src/app/service/user.service';
import { GroupCycle } from 'src/app/model/groupCycle.model';
import { PfpercentService } from 'src/app/service/pfpercent.service';
import { Pfpercent } from 'src/app/model/pfpercent.model';

@Component({
  selector: 'app-group-cycle-add',
  templateUrl: './group-cycle-add.component.html',
  styleUrls: ['./group-cycle-add.component.css']
})
export class GroupCycleAddComponent implements OnInit {

  pfPercentList: Pfpercent[] = [];
  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Input() groupId: string;
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();
  @Output() valueChange = new EventEmitter();
  group: GroupCycle;


  constructor(
    public authService: AuthService,
    public groupCycleService: GroupCycleService,
    public pfpercentService: PfpercentService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      start_date: new FormControl(null, { validators: [Validators.required] }),
      month_count	: new FormControl(null, { validators: [Validators.required] }),
      group_type_id: new FormControl(null, { validators: [Validators.required] }),
    });


    this.pfpercentService.all_pf_percent_list().subscribe((response: any) => {
      this.pfPercentList = response.pfpercentList;
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
          this.groupCycleService.groupCycle_detail(this.mainId)
          .subscribe((response: any) => {
            this.group =  response.groupDetail;
            this.form.patchValue({
              start_date: this.group.start_date,
              month_count: this.group.month_count,
              group_type_id: this.group.group_type_id
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

      this.groupCycleService.addGroupCycle(
        this.groupId,
        this.form.value.start_date,
        this.form.value.month_count,
        this.form.value.group_type_id
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopup').click();
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
      this.groupCycleService.editGroupCycle(
        this.group.id,
        this.groupId,
        this.form.value.start_date,
        this.form.value.month_count,
        this.form.value.group_type_id
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
    this.closeModal.emit("none");
  }

}
