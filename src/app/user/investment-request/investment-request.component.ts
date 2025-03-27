import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestmentRequest } from 'src/app/model/InvestmentRequest.model';
import { InvestmentRequestService } from 'src/app/service/investmentRequest.service';

@Component({
  selector: 'app-investment-request',
  templateUrl: './investment-request.component.html',
  styleUrls: ['./investment-request.component.css']
})
export class InvestmentRequestComponent implements OnInit {

  lists: InvestmentRequest[] = [];
  listDetail: InvestmentRequest;
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private listsSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectListId: string;
  userId: string;
  groupId: string;
  display : string  ="none"

  constructor(
    public investmentRequestService: InvestmentRequestService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.investmentRequestService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
      this.listsSub = this.investmentRequestService.getListUpdateListener().subscribe(
        (listData: { lists: InvestmentRequest[]; listCount: number }) => {
        this.lists = listData.lists;
        this.totalLists =  listData.listCount;
        this.isLoading = false;
        this.isLoadingPage = false;
        console.log(this.listDetail, 'listDetail');
      });
    });
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.investmentRequestService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
  }

  onview(id: string, index: number) {
    this.listDetail = this.lists[index];
    this.display = 'block';
  }

  onClose()
  {
    this.display = 'none';
  }
}
