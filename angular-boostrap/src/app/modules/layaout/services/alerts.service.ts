import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


export enum AlertTypeEnum {
  Success,
  Info,
  Danger,
  Warning,
  Default
}

export class Alert{
  type: AlertTypeEnum = AlertTypeEnum.Default;
  title: string = "";
  message: string = ""; 
}



@Injectable({
  providedIn: 'root'
})
export class AlertsService {

constructor(private toastr: ToastrService) { }

public showMessage(alert: Alert){
  switch(alert.type){
    case AlertTypeEnum.Danger:
      this.toastr.error(alert.message, alert.title)      
      break;
      case AlertTypeEnum.Success:
      this.toastr.success(alert.message, alert.title)
      break;
      case AlertTypeEnum.Info:
      this.toastr.info(alert.message, alert.title)
      break;
      case AlertTypeEnum.Warning:
      this.toastr.warning(alert.message, alert.title)
      break;
      default:
        this.toastr.show(alert.message, alert.title);
        break;
  }
}

}
