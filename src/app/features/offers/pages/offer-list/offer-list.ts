import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OffersService } from '../../services/offers.service';
import { JobOffer, PolandContractType } from '../../../../shared/components/interfaces/job-offer.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './offer-list.html',
  styleUrls: ['./offer-list.css']
})
export class OfferListComponent implements OnInit {
  private offersService = inject(OffersService);

  // Listas de datos
  offers: JobOffer[] = [];
  filteredOffers: JobOffer[] = [];

  // Variables para los filtros del buscador
  searchQuery: string = '';
  selectedLocation: string = '';
  selectedContract: string = '';

  // Opciones fijas para los selectores de Polonia
  locations: string[] = ['Varsovia', 'Cracovia', 'Breslavia', 'Poznań', 'Gdańsk'];
  contractTypes: PolandContractType[] = ['Umowa o pracę', 'Umowa zlecenie', 'Umowa o dzieło', 'B2B'];

  ngOnInit(): void {
    // Llamada al servicio HTTP conectado a MongoDB
    this.offersService.getOffers().subscribe({
      next: (data) => {
        this.offers = data;
        this.filteredOffers = data; // Al inicio muestra todo
      },
      error: (err) => console.error('Error al cargar ofertas desde MongoDB', err)
    });
  }

  // Lógica de filtrado en tiempo real
  applyFilters(): void {
    this.filteredOffers = this.offers.filter(offer => {
      const matchesSearch = offer.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            offer.company.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesLocation = this.selectedLocation === '' || offer.location === this.selectedLocation;
      
      const matchesContract = this.selectedContract === '' || offer.contractType === this.selectedContract;

      return matchesSearch && matchesLocation && matchesContract;
    });
  }
}