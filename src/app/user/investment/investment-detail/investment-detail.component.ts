import { Component, OnInit, Input, SimpleChange, OnChanges, EventEmitter, Output } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { Investment } from 'src/app/model/investment.model';
import { InvestmentService } from 'src/app/service/investment.service';


@Component({
  selector: 'app-investment-detail',
  templateUrl: './investment-detail.component.html',
  styleUrls: ['./investment-detail.component.css']
})
export class InvestmentDetailComponent implements OnInit, OnChanges {

  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();

  mainId: string;
  investment: Investment;
  isLoading = true;

  constructor(
    public investmentService: InvestmentService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
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

          this.isLoading = true;
          this.investmentService.investment_detail(this.mainId).subscribe((response: any) => {
            this.investment = response.investmentDetail
            this.isLoading = false;
          });
      }
    }
  }

  onClose(): void {
    this.closeModal.emit("none");
  }

}
