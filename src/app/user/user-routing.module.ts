import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthUserGuard } from '../auth/auth-user.guard';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './userInfo/user-list/user-list.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PrivacyPolicyUpdateComponent } from './pages/privacy-policy-update/privacy-policy-update.component';
import { TermsUpdateComponent } from './pages/terms-update/terms-update.component';
import { UserDetailComponent } from './userInfo/user-detail/user-detail.component';
import { GroupListComponent } from './group/group-list/group-list.component';
import { GroupCycleListComponent } from './group-cycle/group-cycle-list/group-cycle-list.component';
import { GroupCycleUserListComponent } from './group-cycle-user/group-cycle-user-list/group-cycle-user-list.component';
import { UserGroupListComponent } from './userInfo/user-group-list/user-group-list.component';
import { UserGroupAddListComponent } from './userInfo/user-group-add-list/user-group-add-list.component';
import { SafeKeepingListComponent } from './safeKeeping/safe-keeping-list/safe-keeping-list.component';
import { LoanListComponent } from './loan/loan-list/loan-list.component';
import { LoanPaymentComponent } from './loan/loan-payment/loan-payment.component';
import { LoanStatusHistoryComponent } from './loan/loan-status-history/loan-status-history.component';
import { PfListComponent } from './pf/pf-list/pf-list.component';
import { PayoutListComponent } from './payout-list/payout-list.component';
import { GroupCycleStatusHistoryComponent } from './group-cycle-user/group-cycle-status-history/group-cycle-status-history.component';
import { SingleUserGroupList } from '../service/singleUserGroupList.service';
import { SingleUserGroupListComponent } from './userInfo/single-user-group-list/single-user-group-list.component';
import { SingleUserDetailComponent } from './userInfo/single-user-detail/single-user-detail.component';
import { EmergencyLoanListComponent } from './emergency-loan/emergency-loan-list/emergency-loan-list.component';
import { EmergencyLoanStatusHistoryComponent } from './emergency-loan/emergency-loan-status-history/emergency-loan-status-history.component';
import { RecommendUserListComponent } from './recommend-user-list/recommend-user-list.component';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { InvestmentListComponent } from './investment/investment-list/investment-list.component';
import { ProfitListComponent } from './profit/profit-list/profit-list.component';
import { PropertyAddComponent } from './property/property-add/property-add.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { AgmDemoMapComponent } from './demo/agm-demo-map/agm-demo-map.component';
import { SafeKeepingWithdralRequestComponent } from './safe-keeping-withdral-request/safe-keeping-withdral-request.component';
import { AgmDemoDirectionComponent } from './demo/agm-demo-direction/agm-demo-direction.component';
import { AgmDemoCordinatesComponent } from './demo/agm-demo-cordinates/agm-demo-cordinates.component';
import { SubadminAddComponent } from './subadmin/subadmin-add/subadmin-add.component';
import { SubadminListComponent } from './subadmin/subadmin-list/subadmin-list.component';
import { InvestmentRequestComponent } from './investment-request/investment-request.component';
import { AgmSearchMapComponent } from './demo/agm-search-map/agm-search-map.component';
import { PfPercentListComponent } from './pf-percent/pf-percent-list/pf-percent-list.component';
import { PfPercentAddComponent } from './pf-percent/pf-percent-add/pf-percent-add.component';
import { MiscellaneousListComponent } from './miscellaneous/miscellaneous-list/miscellaneous-list.component';
import { MiscellaneousStatusHistoryComponent } from './miscellaneous/miscellaneous-status-history/miscellaneous-status-history.component';
import { LoanPercentListComponent } from './loan-percent/loan-percent-list/loan-percent-list.component';
import { MiscellaneousPaymentComponent } from './miscellaneous/miscellaneous-payment/miscellaneous-payment.component';
import { BlockUserComponent } from './block-user/block-user.component';
import { AddbannerMessagesComponent } from './addbanner-messages/addbanner-messages.component';
import { UserCreditScoreComponent } from './user-credit-score/user-credit-score.component';

/*Aishwarya Holkar Changes Start*/
import { HelpToBuyCarComponent } from './loan/help-to-buy-car/help-to-buy-car.component'
import { HelpToBuyPropertyComponent} from './loan/help-to-buy-property/help-to-buy-property.component'
import {HelpToPayCarInsuraneComponent} from './loan/help-to-pay-car-insurane/help-to-pay-car-insurane.component'
import {HelpToPayccComponent} from './loan/help-to-paycc/help-to-paycc.component'
import {GroupsOfUserComponent} from './dashboard/groups-of-user/groups-of-user.component'
import {GroupedUserDetailComponent} from './dashboard/grouped-user-detail/grouped-user-detail.component'
import { WelfareComponent } from './loan/welfare/welfare.component';
import { NotesHistoryComponent } from './loan/welfare/notes-history/notes-history.component';
import { CircleListComponent } from './group/groupCircle/circle-list/circle-list.component';
import { CircleUsersComponent } from './group/groupCircle/circle-list/circle-users/circle-users.component';
import { CircleUsersAddComponent } from './group/groupCircle/circle-users-add/circle-users-add.component';
import { UpdateUserPaymentComponent } from './userInfo/update-user-payment/update-user-payment.component';
import { AdminNotificationsComponent } from './admin-notifications/admin-notifications.component';
/*Aishwarya Holkar Changes Ends*/

const routes: Routes = [
  {
    path: '',
    children: [
         {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'categoryList',
            component: CategoryListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'updateProfile',
            component: UpdateProfileComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'userList',
            component: UserListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'userGroupList/:groupId',
            component: UserGroupListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'UserGroupAddList/:groupId',
            component: UserGroupAddListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'circleUserGroupAddList/:groupId/:circleId',
            component: CircleUsersAddComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'privacyPolicy',
            component: PrivacyPolicyUpdateComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'termCondition',
            component: TermsUpdateComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'userDetail/:userId',
            component: UserDetailComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'changePassword',
            component: ChangePasswordComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'addbanner-messages',
            component: AddbannerMessagesComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'user-credit-score',
            component: UserCreditScoreComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'groupList',
            component: GroupListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'circleList/:groupID',
            component: CircleListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'circleUserList/:groupId/:circleId',
            component: CircleUsersComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'groupCycleList/:groupId',
            component: GroupCycleListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'groupCycleUserList/:groupId/:userId/:firstname/:lastname/:email',
            component: GroupCycleUserListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'groupCycleJNRUserList/:groupId/:userId/:lifeCycleType/:firstname/:lastname/:email',
            component: GroupCycleUserListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'groupHelpToBuyUserList/:groupId/:userId/:lifeCycleType/:firstname/:lastname/:email',
            component: GroupCycleUserListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'safeKeepingList/:groupId/:userId',
            component: SafeKeepingListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'loanList/:groupId/:userId',
            component: LoanListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'LoanPayment/:groupId/:userId/:loanId',
            component: LoanPaymentComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'miscellaneousPayment/:groupId/:userId/:loanId',
            component: MiscellaneousPaymentComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'loanStatusHistory/:loanId',
            component: LoanStatusHistoryComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'pfList/:groupId/:userId',
            component: PfListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'payoutList/:groupId/:userId/:firstname/:lastname/:email',
            component: PayoutListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'payoutJNRList/:groupId/:userId/:lifeCycleType',
            component: PayoutListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'payoutHelpToBuyList/:groupId/:userId/:lifeCycleType',
            component: PayoutListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'groupCycleStatusHistory/:cycleId',
            component: GroupCycleStatusHistoryComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'singleUserGroupList/:userId',
            component: SingleUserGroupListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'blockUser',
            component: BlockUserComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'adminNotifications',
            component: AdminNotificationsComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'singleUserDetail/:userId/:groupId',
            component: SingleUserDetailComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'emergencyLoanList/:groupId/:userId',
            component: EmergencyLoanListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'miscellaneousList/:groupId/:userId',
            component: MiscellaneousListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'emergencyLoanStatusHistory/:loanId',
            component: EmergencyLoanStatusHistoryComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'miscellaneousLoanStatusHistory/:loanId',
            component: MiscellaneousStatusHistoryComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'recommendUserList',
            component: RecommendUserListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'propertyList',
            component: PropertyListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'propertyAdd',
            component: PropertyAddComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'propertyEdit/:propertyId',
            component: PropertyAddComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'investmentList/:groupId/:userId',
            component: InvestmentListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'profitList/:groupId/:userId',
            component: ProfitListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'notificationList',
            component: NotificationListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'agmDemoMap',
            component: AgmDemoMapComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'agmDemoDirection',
            component: AgmDemoDirectionComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'agmDemoCordinates',
            component: AgmDemoCordinatesComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'agmSearchMap',
            component: AgmSearchMapComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'safeKeepingWithdral',
            component: SafeKeepingWithdralRequestComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'subadminList',
            component: SubadminListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'investmentRequest',
            component: InvestmentRequestComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'PfPercentList',
            component: PfPercentListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'loanPercentList',
            component: LoanPercentListComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'helpToBuyCar/:groupId/:userId',
            component: HelpToBuyCarComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'helpToBuyProperty/:groupId/:userId',
            component: HelpToBuyPropertyComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'helpToPayCarInsurane/:groupId/:userId',
            component: HelpToPayCarInsuraneComponent,
            canActivate: [AuthUserGuard]
         },
         {
            path: 'helpToPaycc/:groupId/:userId',
            component: HelpToPayccComponent,
            canActivate: [AuthUserGuard]
         },
         { path: 'groupsOfuser',
           component : GroupsOfUserComponent,
           canActivate: [AuthUserGuard]
         },
         { path: 'UpdateUserPayment/:id',
           component : UpdateUserPaymentComponent,
       
         },
         { path: 'groupedUserDetail/:groupId',
         component : GroupedUserDetailComponent,
         canActivate: [AuthUserGuard]
         },
         {
           path : 'welfare/:groupId/:userId',
           component : WelfareComponent,
           canActivate: [AuthUserGuard]
         },
         {
          path: 'notesHistoryComponent/:cycleId',
          component: NotesHistoryComponent,
          canActivate: [AuthUserGuard]

         }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthUserGuard
  ]
})
export class UserRoutingModule { }
