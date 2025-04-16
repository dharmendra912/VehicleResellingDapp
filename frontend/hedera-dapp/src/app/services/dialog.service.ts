import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DialogConfig {
  title: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogConfig = new BehaviorSubject<DialogConfig>({
    title: '',
    message: '',
    type: 'info',
    show: false
  });

  dialogConfig$ = this.dialogConfig.asObservable();

  showInfo(title: string, message: string) {
    this.dialogConfig.next({
      title,
      message,
      type: 'info',
      show: true
    });
  }

  showError(title: string, message: string) {
    this.dialogConfig.next({
      title,
      message,
      type: 'error',
      show: true
    });
  }

  showSuccess(title: string, message: string) {
    this.dialogConfig.next({
      title,
      message,
      type: 'success',
      show: true
    });
  }

  showWarning(title: string, message: string) {
    this.dialogConfig.next({
      title,
      message,
      type: 'warning',
      show: true
    });
  }

  hide() {
    this.dialogConfig.next({
      ...this.dialogConfig.value,
      show: false
    });
  }
} 