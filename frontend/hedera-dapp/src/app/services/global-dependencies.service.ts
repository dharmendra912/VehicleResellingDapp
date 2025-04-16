import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import * as base64js from 'base64-js';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class GlobalDependenciesService {
  constructor() {
    this.initializeGlobals();
  }

  private initializeGlobals(): void {
    try {
      if (typeof window !== 'undefined') {
        // @ts-ignore - We know these are valid assignments
        window.Buffer = Buffer;
        // @ts-ignore - We know these are valid assignments
        window.ethers = ethers;

        // Instead of assigning base64 to window, we'll use it directly in our service
        // @ts-ignore - We know these are valid assignments
        window.base64ToBytes = base64js.toByteArray;
        // @ts-ignore - We know these are valid assignments
        window.bytesToBase64 = base64js.fromByteArray;
      }
    } catch (error) {
      console.error('Error initializing global dependencies:', error);
    }
  }
}
