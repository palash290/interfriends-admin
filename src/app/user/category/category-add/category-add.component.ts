import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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
  @Input() eachChange: string;
  @Input() add: string;
  @Output() valueChange = new EventEmitter();
  category: Category;
  imagePreview = 'assets/img/default-user-icon.jpg';

  constructor(
    public authService: AuthService,
    public categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      category_name: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {})
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
          this.categoryService.categoryDetail(this.mainId)
          .subscribe((response: any) => {
            this.category =  response.categoryDetail;
            this.form.patchValue({
              category_name: this.category.category_name
            });
            this.isLoadingUpdate = false;
            this.imagePreview = this.category.category_image_thumb;
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
    console.log(this.form);

    if (this.mode === 'create') {

      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;

      this.categoryService.addCategory(
        this.form.value.category_name,
        this.form.value.image,
      ).subscribe((response: any) => {
        this.form.reset();
        this.imagePreview = 'assets/img/default-user-icon.jpg';
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
      this.categoryService.editCategory(
        this.category.category_id,
        this.form.value.category_name,
        this.form.value.image,
      ).subscribe((response: any) => {
        this.form.reset();
        this.imagePreview = 'assets/img/default-user-icon.jpg';
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
    this.imagePreview = 'assets/img/default-user-icon.jpg';
  }

}
