import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobOffer } from '../../../shared/components/interfaces/job-offer.model';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  // URL del backend de Node.js
  private readonly apiUrl = 'http://localhost:3001/api/offers';

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  getOffers(): Observable<JobOffer[]> {
    return new Observable<JobOffer[]>((observer) => {
      fetch(this.apiUrl)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const data = await response.json();
          observer.next(data);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  getOfferById(id: string): Observable<JobOffer> {
    return new Observable<JobOffer>((observer) => {
      fetch(`${this.apiUrl}/${id}`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const data = await response.json();
          observer.next(data);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  addOffer(offer: Omit<JobOffer, 'id' | 'postedDate'>): Observable<JobOffer> {
    return new Observable<JobOffer>((observer) => {
      fetch(this.apiUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(offer)
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const data = await response.json();
          observer.next(data);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  updateOffer(id: string, offer: Partial<JobOffer>): Observable<JobOffer> {
    return new Observable<JobOffer>((observer) => {
      fetch(`${this.apiUrl}/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(offer)
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const data = await response.json();
          observer.next(data);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  deleteOffer(id: string): Observable<void> {
    return new Observable<void>((observer) => {
      fetch(`${this.apiUrl}/${id}`, { method: 'DELETE', headers: this.getHeaders() })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          observer.next();
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }
}