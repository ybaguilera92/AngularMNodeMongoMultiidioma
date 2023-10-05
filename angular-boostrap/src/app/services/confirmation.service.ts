import { EventEmitter, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../widgets/Components/confirmation-modal/confirmation-modal.component';


@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

constructor(private modalService: NgbModal) { }

public showConfirmation(title: string,message: string) : EventEmitter<boolean> {
  const modalRef = this.modalService.open(ConfirmationModalComponent, { size: 'sm', centered: true });
  modalRef.componentInstance.title = title;
  modalRef.componentInstance.message = message;
  return modalRef.componentInstance.confirmationResult;
}

}
