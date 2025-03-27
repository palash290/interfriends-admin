import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UserListComponent } from './userInfo/user-list/user-list.component';
import { CategoryAddComponent } from './category/category-add/category-add.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { DateAgoPipe } from '../pipe/dateAgo.pipe';


//third party
import { ImageCropperModule } from 'ngx-image-cropper';

import { PrivacyPolicyUpdateComponent } from './pages/privacy-policy-update/privacy-policy-update.component';
import { TermsUpdateComponent } from './pages/terms-update/terms-update.component';
import { UserDetailComponent } from './userInfo/user-detail/user-detail.component';

import { AddUserComponent } from './userInfo/add-user/add-user.component';


import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GroupListComponent } from './group/group-list/group-list.component';
import { GroupAddComponent } from './group/group-add/group-add.component';
import { GroupCycleListComponent } from './group-cycle/group-cycle-list/group-cycle-list.component';
import { GroupCycleAddComponent } from './group-cycle/group-cycle-add/group-cycle-add.component';
import { GroupCycleUserListComponent } from './group-cycle-user/group-cycle-user-list/group-cycle-user-list.component';
import { AddGroupCycleUserComponent } from './group-cycle-user/add-group-cycle-user/add-group-cycle-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserGroupListComponent } from './userInfo/user-group-list/user-group-list.component';
import { UserGroupAddListComponent } from './userInfo/user-group-add-list/user-group-add-list.component';
import { EditGroupUserInfoComponent } from './userInfo/edit-group-user-info/edit-group-user-info.component';
import { SafeKeepingListComponent } from './safeKeeping/safe-keeping-list/safe-keeping-list.component';
import { LoanListComponent } from './loan/loan-list/loan-list.component';
import { LoanPaymentComponent } from './loan/loan-payment/loan-payment.component';
import { AddLoanPaymentComponent } from './loan/add-loan-payment/add-loan-payment.component';
import { AddLoanComponent } from './loan/add-loan/add-loan.component';
import { PayoutListComponent } from './payout-list/payout-list.component';
import { LoanStatusHistoryComponent } from './loan/loan-status-history/loan-status-history.component';
import { PfListComponent } from './pf/pf-list/pf-list.component';
import { GroupCycleStatusHistoryComponent } from './group-cycle-user/group-cycle-status-history/group-cycle-status-history.component';
import { SingleUserGroupListComponent } from './userInfo/single-user-group-list/single-user-group-list.component';
import { SingleUserDetailComponent } from './userInfo/single-user-detail/single-user-detail.component';
import { EmergencyLoanListComponent } from './emergency-loan/emergency-loan-list/emergency-loan-list.component';
import { EmergencyLoanAddComponent } from './emergency-loan/emergency-loan-add/emergency-loan-add.component';
import { EmergencyLoanStatusHistoryComponent } from './emergency-loan/emergency-loan-status-history/emergency-loan-status-history.component';
import { RecommendUserListComponent } from './recommend-user-list/recommend-user-list.component';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { PropertyAddComponent } from './property/property-add/property-add.component';
import { InvestmentListComponent } from './investment/investment-list/investment-list.component';
import { InvestmentAddComponent } from './investment/investment-add/investment-add.component';
import { InvestmentDetailComponent } from './investment/investment-detail/investment-detail.component';
import { ProfitListComponent } from './profit/profit-list/profit-list.component';
import { ProfitAddComponent } from './profit/profit-add/profit-add.component';
import { ProfitDetailComponent } from './profit/profit-detail/profit-detail.component';
import { ImageDragDirective } from '../directive/image-drag.directive';
import { NotificationListComponent } from './notification-list/notification-list.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';

// import { GoogleMapsModule } from '@angular/google-maps';
import { AgmCoreModule} from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmDemoMapComponent } from './demo/agm-demo-map/agm-demo-map.component';
import { SafeKeepingWithdralRequestComponent } from './safe-keeping-withdral-request/safe-keeping-withdral-request.component';
import { AgmDemoDirectionComponent } from './demo/agm-demo-direction/agm-demo-direction.component';
import { AgmDemoCordinatesComponent } from './demo/agm-demo-cordinates/agm-demo-cordinates.component';
import { SubadminListComponent } from './subadmin/subadmin-list/subadmin-list.component';
import { SubadminAddComponent } from './subadmin/subadmin-add/subadmin-add.component';
import { InvestmentRequestComponent } from './investment-request/investment-request.component';
import { AgmSearchMapComponent } from './demo/agm-search-map/agm-search-map.component';
import { PfPercentListComponent } from './pf-percent/pf-percent-list/pf-percent-list.component';
import { PfPercentAddComponent } from './pf-percent/pf-percent-add/pf-percent-add.component';
import { AddLoanDefaultComponent } from './loan/add-loan-default/add-loan-default.component';
import { EmergencyLoanDefaultComponent } from './emergency-loan/emergency-loan-default/emergency-loan-default.component';
import { PfAddComponent } from './pf/pf-add/pf-add.component';
import { AddSafeKeepingComponent } from './safeKeeping/add-safe-keeping/add-safe-keeping.component';
import { MiscellaneousAddComponent } from './miscellaneous/miscellaneous-add/miscellaneous-add.component';
import { MiscellaneousListComponent } from './miscellaneous/miscellaneous-list/miscellaneous-list.component';
import { MiscellaneousStatusHistoryComponent } from './miscellaneous/miscellaneous-status-history/miscellaneous-status-history.component';
import { MiscellaneousDefaultComponent } from './miscellaneous/miscellaneous-default/miscellaneous-default.component';
import { LoanPercentAddComponent } from './loan-percent/loan-percent-add/loan-percent-add.component';
import { LoanPercentListComponent } from './loan-percent/loan-percent-list/loan-percent-list.component';
import { MiscellaneousPaymentComponent } from './miscellaneous/miscellaneous-payment/miscellaneous-payment.component';
import { AddMiscellaneousPaymentComponent } from './miscellaneous/add-miscellaneous-payment/add-miscellaneous-payment.component';
import { BlockUserComponent } from './block-user/block-user.component';
import { AddbannerMessagesComponent } from './addbanner-messages/addbanner-messages.component';
import { UserCreditScoreComponent } from './user-credit-score/user-credit-score.component';
import { HelpToBuyPropertyComponent } from './loan/help-to-buy-property/help-to-buy-property.component';
import { HelpToBuyCarComponent } from './loan/help-to-buy-car/help-to-buy-car.component';
import { HelpToPayccComponent } from './loan/help-to-paycc/help-to-paycc.component';
import { HelpToPayCarInsuraneComponent } from './loan/help-to-pay-car-insurane/help-to-pay-car-insurane.component';
import { GroupsOfUserComponent } from './dashboard/groups-of-user/groups-of-user.component';
import { GroupedUserDetailComponent } from './dashboard/grouped-user-detail/grouped-user-detail.component';
import { WelfareComponent } from './loan/welfare/welfare.component';
import { NotesHistoryComponent } from './loan/welfare/notes-history/notes-history.component';
import { CircleListComponent } from './group/groupCircle/circle-list/circle-list.component';
import { CircleUsersComponent } from './group/groupCircle/circle-list/circle-users/circle-users.component';
import { CircleUsersAddComponent } from './group/groupCircle/circle-users-add/circle-users-add.component';
import { UpdateUserPaymentComponent } from './userInfo/update-user-payment/update-user-payment.component';
import { AdminNotificationsComponent } from './admin-notifications/admin-notifications.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    ImageCropperModule,
    // GoogleMapsModule,
    CKEditorModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBz_5wUAu5_IYnw4RnwiK50qT1GUQiy1DE',
      libraries: ['places', 'geometry']
    }),
    AgmDirectionModule
  ],
  declarations: [
  DashboardComponent,
  HeaderComponent,
  SidebarComponent,
  FooterComponent,
  CategoryListComponent,
  UpdateProfileComponent,
  UserListComponent,
  CategoryAddComponent,
  ChangePasswordComponent,
  PrivacyPolicyComponent,
  PrivacyPolicyUpdateComponent,
  TermsUpdateComponent,
  UserDetailComponent,
  AddUserComponent,
  GroupListComponent,
  GroupAddComponent,
  GroupCycleListComponent,
  GroupCycleAddComponent,
  GroupCycleUserListComponent,
  AddGroupCycleUserComponent,
  UserGroupListComponent,
  UserGroupAddListComponent,
  EditGroupUserInfoComponent,
  SafeKeepingListComponent,
  LoanListComponent,
  LoanPaymentComponent,
  AddLoanPaymentComponent,
  AddLoanComponent,
  PayoutListComponent,
  LoanStatusHistoryComponent,
  PfListComponent,
  GroupCycleStatusHistoryComponent,
  SingleUserGroupListComponent,
  SingleUserDetailComponent,
  EmergencyLoanListComponent,
  EmergencyLoanAddComponent,
  EmergencyLoanStatusHistoryComponent,
  RecommendUserListComponent,
  PropertyListComponent,
  PropertyAddComponent,
  InvestmentListComponent,
  InvestmentAddComponent,
  InvestmentDetailComponent,
  ProfitListComponent,
  ProfitAddComponent,
  ProfitDetailComponent,
  ImageDragDirective,
  NotificationListComponent,
  DateAgoPipe,
  AgmDemoMapComponent,
  SafeKeepingWithdralRequestComponent,
  AgmDemoDirectionComponent,
  AgmDemoCordinatesComponent,
  SubadminListComponent,
  SubadminAddComponent,
  InvestmentRequestComponent,
  AgmSearchMapComponent,
  PfPercentListComponent,
  PfPercentAddComponent,
  AddLoanDefaultComponent,
  EmergencyLoanDefaultComponent,
  PfAddComponent,
  AddSafeKeepingComponent,
  MiscellaneousAddComponent,
  MiscellaneousListComponent,
  MiscellaneousStatusHistoryComponent,
  MiscellaneousDefaultComponent,
  LoanPercentAddComponent,
  LoanPercentListComponent,
  MiscellaneousPaymentComponent,
  AddMiscellaneousPaymentComponent,
  BlockUserComponent,
  AddbannerMessagesComponent,
  UserCreditScoreComponent,
  HelpToBuyPropertyComponent,
  HelpToBuyCarComponent,
  HelpToPayccComponent,
  HelpToPayCarInsuraneComponent,
  GroupsOfUserComponent,
  GroupedUserDetailComponent,
  WelfareComponent,
  NotesHistoryComponent,
  CircleListComponent,
  CircleUsersComponent,
  CircleUsersAddComponent,
  UpdateUserPaymentComponent,
  AdminNotificationsComponent
  ],
  providers: [],
  exports: [],
})


export class UserModule { }
