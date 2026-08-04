import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService} from '../../../service/auth.service';
import { CategoryService} from '../../../service/category.service';
import { Category } from 'src/app/model/category.model';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit, OnChanges {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() categoryName: string;
  @Input() categoryStatus: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Output() valueChange = new EventEmitter();
  category: Category;
  subAdminId: any;

  constructor(
    public authService: AuthService,
    public categoryService: CategoryService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.subAdminId = localStorage.getItem('userId_interFriendAdmin');
    this.mode = 'create';
    this.form = new FormGroup({
      category_name: new FormControl(null, { validators: [Validators.required] }),
      status: new FormControl('1', { validators: [Validators.required] })
    });
  }


  ngOnChanges(changes: { [property: string]: SimpleChange }): void {
    if (changes['uniqueId'] !== undefined || changes['eachChange'] !== undefined) {
      if (changes['eachChange'].currentValue !== undefined) {
          this.isLoadingUpdate = true;
          this.mode = 'update';
          this.mainId = changes['uniqueId']?.currentValue || this.mainId;
          this.form.patchValue({
            category_name: this.categoryName || '',
            status: this.categoryStatus || '1'
          });
          this.isLoadingUpdate = false;
      }
    }

    if (changes['add'] !== undefined) {
          if (changes['add'].currentValue !== undefined) {
            this.mode = 'create';
          }
    }

  }


  private getCategoryCreator(): { createdBy: string; createdByType: string } {
    const adminType = localStorage.getItem('admin_type_interFriendAdmin');
    const userId = localStorage.getItem('userId_interFriendAdmin');

    if (adminType == '1') {
      return {
        createdBy: userId || '',
        createdByType: 'subadmin'
      };
    }

    return {
      createdBy: '1',
      createdByType: 'admin'
    };
  }


  private getCategoryUpdater(): { updatedBy: string; updatedByType: string } {
    const adminType = localStorage.getItem('admin_type_interFriendAdmin');
    const userId = localStorage.getItem('userId_interFriendAdmin');

    if (adminType === '1') {
      return {
        updatedBy: userId || '',
        updatedByType: 'subadmin'
      };
    }

    return {
      updatedBy: '1',
      updatedByType: 'admin'
    };
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
      const creator = this.getCategoryCreator();

      this.categoryService.addServiceCategory(
        this.form.value.category_name,
        creator.createdBy,
        creator.createdByType,
        this.subAdminId
      ).subscribe((response: any) => {
        this.form.reset();
        this.form.patchValue({ status: '1' });
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
      const updater = this.getCategoryUpdater();
      this.categoryService.updateServiceCategory(
        this.mainId,
        this.form.value.category_name,
        this.form.value.status,
        updater.updatedBy,
        updater.updatedByType,
        this.subAdminId
      ).subscribe((response: any) => {
        this.form.reset();
        this.form.patchValue({ status: '1' });
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


  onClose(): void {
    this.form.reset();
    this.form.patchValue({ status: '1' });
  }

}
