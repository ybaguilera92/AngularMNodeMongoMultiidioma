import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() public title: string;
  @Input() public message: string;
  @Output() public confirmationResult: EventEmitter<boolean> = new EventEmitter();
  constructor(public modal: NgbActiveModal, public translate: TranslateService) { }

  ngOnInit() {
  }

  public confirm()
  {
    this.confirmationResult.emit(true);
    this.modal.dismiss();
  }
  public cancel()
  {
    this.confirmationResult.emit(false);
    this.modal.dismiss();
  }
}
