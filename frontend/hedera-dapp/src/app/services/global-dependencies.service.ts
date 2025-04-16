import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import * as base64js from 'base64-js';

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
        // Create a simple Buffer polyfill
        const BufferPolyfill = {
          from: (data: string | Uint8Array, encoding?: string) => {
            if (typeof data === 'string') {
              return new TextEncoder().encode(data);
            }
            return data;
          },
          isBuffer: (obj: any) => obj instanceof Uint8Array
        };

        // @ts-ignore - We know these are valid assignments
        window.Buffer = BufferPolyfill;
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

  // Helper methods for base64 operations
  public base64ToBytes(base64String: string): Uint8Array {
    return base64js.toByteArray(base64String);
  }

  public bytesToBase64(bytes: Uint8Array): string {
    return base64js.fromByteArray(bytes);
  }
} 