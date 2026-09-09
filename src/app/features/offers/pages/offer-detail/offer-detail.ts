import { ChangeDetectorRef, Component, NgZone, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OffersService } from '../../services/offers.service';
import { AuthService } from '../../../../services/auth.service';
import { JobOffer } from '../../../../shared/components/interfaces/job-offer.model';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './offer-detail.html',
  styleUrls: ['./offer-detail.css']
})
export class OfferDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private offersService = inject(OffersService);
  private router = inject(Router);
  public authService = inject(AuthService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  offer?: JobOffer;
  loading: boolean = true;
  errorMessage: string = '';

  deleteOffer(): void {
    if (!this.offer?.id || !confirm('¿Seguro que quieres eliminar esta oferta?')) {
      return;
    }

    this.offersService.deleteOffer(this.offer.id).subscribe({
      next: () => {
        alert('La oferta se eliminó correctamente.');
        this.router.navigate(['/offers']);
      },
      error: (err) => {
        console.error('Error al eliminar la oferta:', err);
        alert('No se pudo eliminar la oferta.');
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (!id) {
          this.errorMessage = 'ID de oferta no válido.';
          this.loading = false;
          return;
        }

        this.offersService.getOfferById(id).subscribe({
          next: (data) => {
            this.zone.run(() => {
              this.offer = data;
              this.loading = false;
              this.cdr.detectChanges();
            });
          },
          error: (err) => {
            console.error('Error al obtener la oferta:', err);
            this.zone.run(() => {
              this.errorMessage = 'No se pudo cargar la oferta especificada.';
              this.loading = false;
              this.cdr.detectChanges();
            });
          }
        });
      },
      error: (err) => {
        console.error('Error al leer la ruta:', err);
        this.errorMessage = 'No se pudo leer la ruta de la oferta.';
        this.loading = false;
      }
    });
  }
}