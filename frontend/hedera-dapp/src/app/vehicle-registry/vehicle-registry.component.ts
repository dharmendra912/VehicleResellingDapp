import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleRegistryService } from './vehicle-registry.service';

@Component({
  selector: 'app-vehicle-registry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-registry.component.html',
  styleUrls: ['./vehicle-registry.component.css']
})
export class VehicleRegistryComponent {
  vehicleId = '';
  newOwner = '';
  owner = '';

  constructor(private vr: VehicleRegistryService) {}

  register() {
    this.vr.registerVehicle(this.vehicleId).then(() => {
      alert('Vehicle registered!');
    }).catch(err => alert('Error: ' + err.message));
  }

  resell() {
    this.vr.resellVehicle(this.vehicleId, this.newOwner).then(() => {
      alert('Vehicle resold!');
    }).catch(err => alert('Error: ' + err.message));
  }

  getOwner() {
    this.vr.getOwner(this.vehicleId).then(result => {
      this.owner = result;
    }).catch(err => alert('Error: ' + err.message));
  }
}
