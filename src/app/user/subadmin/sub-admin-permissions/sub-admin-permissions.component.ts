import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-admin-permissions',
  templateUrl: './sub-admin-permissions.component.html',
  styleUrls: ['./sub-admin-permissions.component.css']
})
export class SubAdminPermissionsComponent implements OnInit {

  isLoading = false;

  sidebarItems: any[] = [
    { id: 1, name: 'Dashboard', isChecked: true },
    // { id: 2, name: 'Profile', isChecked: false },
    // { id: 3, name: 'Change Password', isChecked: false },
    { id: 4, name: 'All members', isChecked: false },
    { id: 5, name: 'Blocked members', isChecked: false },
    { id: 6, name: 'Defaulted members', isChecked: false },
    { id: 7, name: 'Sub Admin', isChecked: false },
    { id: 8, name: 'Groups', isChecked: false },
    { id: 9, name: 'Banners and Messages', isChecked: false },
    { id: 10, name: 'Member Trust Scores', isChecked: false },
    { id: 11, name: 'Recommended members', isChecked: false },
    { id: 12, name: 'Safe Keeping Request', isChecked: false },
    { id: 13, name: 'Payout Request', isChecked: false },
    { id: 14, name: 'Welfare Request', isChecked: false },
    { id: 15, name: 'Safe Keeping Cycle Request', isChecked: false },
    { id: 16, name: 'Service management', isChecked: false },
    { id: 17, name: 'Notifications', isChecked: false },
    { id: 18, name: 'Download', isChecked: false },
    { id: 19, name: 'Investment Proposal', isChecked: false },
    { id: 20, name: 'Available investments', isChecked: false },
    { id: 21, name: 'Outstanding Payments', isChecked: false },
    { id: 22, name: 'Privacy Policy', isChecked: false },
    { id: 23, name: 'Terms & Condition', isChecked: false },
    { id: 24, name: 'PF Percent', isChecked: false },
    { id: 25, name: 'Loan Percent', isChecked: false },
    { id: 26, name: 'Contact Management', isChecked: false },
    { id: 27, name: 'All Interested Members', isChecked: false }
  ];

  constructor() { }

  ngOnInit(): void {}

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
      item.isChecked = checked;
    });
  }

  toggleItem(id: number, event: Event): void {
    const item = this.sidebarItems.find((sidebarItem) => sidebarItem.id === id);

    if (item) {
      item.isChecked = (event.target as HTMLInputElement).checked;
    }
  }

}
