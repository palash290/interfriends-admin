import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-sub-admin-permissions',
  templateUrl: './sub-admin-permissions.component.html',
  styleUrls: ['./sub-admin-permissions.component.css']
})
export class SubAdminPermissionsComponent implements OnInit {

  isLoading = false;
  subAdminId: any;

  sidebarItems: any[] = [
    { id: 1, name: 'Dashboard', isChecked: true },
    { id: 2, name: 'All members', isChecked: true },
    { id: 3, name: 'Blocked members', isChecked: false },
    { id: 4, name: 'Defaulted members', isChecked: false },
    { id: 5, name: 'Sub Admin', isChecked: false },
    { id: 6, name: 'Groups', isChecked: false },
    { id: 7, name: 'Banners and Messages', isChecked: false },
    { id: 8, name: 'Member Trust Scores', isChecked: false },
    { id: 9, name: 'Recommended members', isChecked: false },
    { id: 10, name: 'Safe Keeping Request', isChecked: false },
    { id: 11, name: 'Payout Request', isChecked: false },
    { id: 12, name: 'Welfare Request', isChecked: false },
    { id: 13, name: 'Safe Keeping Cycle Request', isChecked: false },
    { id: 14, name: 'Service management', isChecked: false },
    { id: 15, name: 'Notifications', isChecked: false },
    { id: 16, name: 'Download', isChecked: false },
    { id: 17, name: 'Investment Proposal', isChecked: false },
    { id: 18, name: 'Available investments', isChecked: false },
    { id: 19, name: 'Outstanding Payments', isChecked: false },
    { id: 20, name: 'Privacy Policy', isChecked: false },
    { id: 21, name: 'Terms & Condition', isChecked: false },
    { id: 22, name: 'PF Percent', isChecked: false },
    { id: 23, name: 'Loan Percent', isChecked: false },
    { id: 24, name: 'Contact Management', isChecked: false },
    { id: 25, name: 'All Interested Members', isChecked: false }
  ];

  constructor(
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.subAdminId = params['id'];
      if (this.subAdminId) {
        this.getPermissionDetails();
      }
    });
  }

  getPermissionDetails(): void {
    this.isLoading = true;
    const userData = new FormData();
    userData.append('id', this.subAdminId);

    this.sharedService.postAPI('/subadminDetailInfo', userData).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if (resp.userinfo && resp.userinfo.permission_ids) {
          const activeIds = resp.userinfo.permission_ids.split(',').map((id: string) => parseInt(id, 10));
          this.sidebarItems.forEach(item => {
            if (item.id === 1 || item.id === 2) {
              item.isChecked = true;
            } else {
              item.isChecked = activeIds.includes(item.id);
            }
          });
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching permissions info:', err);
      }
    });
  }

  checkAdminType(): boolean {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  get selectedCount(): number {
    return this.sidebarItems.filter((item) => item.isChecked).length;
  }

  get allSelected(): boolean {
    return this.sidebarItems.length > 0 && this.selectedCount === this.sidebarItems.length;
  }

  get indeterminate(): boolean {
    return this.selectedCount > 0 && !this.allSelected;
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.sidebarItems.forEach((item) => {
      if (item.id !== 1 && item.id !== 2) {
        item.isChecked = checked;
      }
    });
  }

  toggleItem(id: number, event: Event): void {
    if (id === 1 || id === 2) {
      return;
    }
    const item = this.sidebarItems.find((sidebarItem) => sidebarItem.id === id);

    if (item) {
      item.isChecked = (event.target as HTMLInputElement).checked;
    }
  }

  savePermissions(): void {
    if (!this.subAdminId) {
      this.toastr.error('Sub-admin ID is missing.');
      return;
    }

    this.isLoading = true;
    const userData = new FormData();
    userData.append('subadmin_id', this.subAdminId);
    
    const checkedIds = this.sidebarItems
      .filter(item => item.isChecked)
      .map(item => item.id)
      .join(',');
    
    userData.append('permission_ids', checkedIds);

    this.sharedService.postAPI('/updateSubadminPermission', userData).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.toastr.success(resp.message || 'Permissions updated successfully.');
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error saving permissions:', error);
        this.toastr.error(error.message || 'Failed to update permissions.');
      }
    });
  }

}
