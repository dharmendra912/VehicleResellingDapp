import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="(dialogService.dialogConfig$ | async)?.show" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header" [ngClass]="{
            'bg-primary text-white': (dialogService.dialogConfig$ | async)?.type === 'info',
            'bg-danger text-white': (dialogService.dialogConfig$ | async)?.type === 'error',
            'bg-success text-white': (dialogService.dialogConfig$ | async)?.type === 'success',
            'bg-warning text-dark': (dialogService.dialogConfig$ | async)?.type === 'warning'
          }">
            <h5 class="modal-title">
              <i *ngIf="(dialogService.dialogConfig$ | async)?.type === 'error'" class="bi bi-exclamation-triangle-fill me-2"></i>
              <i *ngIf="(dialogService.dialogConfig$ | async)?.type === 'success'" class="bi bi-check-circle-fill me-2"></i>
              <i *ngIf="(dialogService.dialogConfig$ | async)?.type === 'warning'" class="bi bi-exclamation-circle-fill me-2"></i>
              <i *ngIf="(dialogService.dialogConfig$ | async)?.type === 'info'" class="bi bi-info-circle-fill me-2"></i>
              {{ (dialogService.dialogConfig$ | async)?.title }}
            </h5>
            <button type="button" class="btn-close" (click)="dialogService.hide()"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">{{ (dialogService.dialogConfig$ | async)?.message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="dialogService.hide()">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="(dialogService.dialogConfig$ | async)?.show" class="modal-backdrop fade show"></div>
  `,
  styles: [`
    .modal {
      background: rgba(0, 0, 0, 0.5);
    }
    .modal.show {
      display: block;
    }
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1040;
      width: 100vw;
      height: 100vh;
      background-color: #000;
    }
  `]
})
export class DialogComponent {
  constructor(public dialogService: DialogService) {}
}
