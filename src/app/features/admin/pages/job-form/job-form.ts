import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OffersService } from '../../../offers/services/offers.service';
import { PolandContractType } from '../../../../shared/components/interfaces/job-offer.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrls: ['./job-form.css']
})
export class JobFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private offersService = inject(OffersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  offerId: string | null = null;
  isEditMode = false;

  // Tipos de contratos disponibles en Polonia
  contractTypes: PolandContractType[] = ['Umowa o pracę', 'Umowa zlecenie', 'Umowa o dzieło', 'B2B'];
  locations: string[] = ['Varsovia', 'Cracovia', 'Breslavia', 'Poznań', 'Gdańsk', 'Katowice', 'Łódź'];

  // Definición del formulario reactivo con sus validaciones
  jobForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    location: ['', Validators.required],
    contractType: ['', Validators.required],
    salary: [null, [Validators.min(0)]],
    requiresPolish: [false],
    requiresEnglish: [false],
    description: ['', [Validators.required, Validators.minLength(20)]],
    
    // Grupo para la Empresa
    company: this.fb.group({
      name: ['', Validators.required],
      industry: ['', Validators.required],
      website: ['']
    }),

    // Toggle para indicar si es a través de Agencia
    isAgency: [false],

    // Grupo opcional para la Agencia
    agency: this.fb.group({
      name: [''],
      krazNumber: [''],
      website: ['']
    }),

    // Array dinámico de requisitos
    requirements: this.fb.array([
      this.fb.control('', Validators.required)
    ])
  });

  // Getter conveniente para acceder al FormArray de requisitos
  get requirements(): FormArray {
    return this.jobForm.get('requirements') as FormArray;
  }

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.offerId;

    if (!this.offerId) {
      return;
    }

    this.offersService.getOfferById(this.offerId).subscribe({
      next: (offer) => {
        this.jobForm.patchValue({
          ...offer,
          isAgency: !!offer.agency
        });
        this.requirements.clear();
        offer.requirements.forEach((requirement) => {
          this.requirements.push(this.fb.control(requirement, Validators.required));
        });
      },
      error: (err) => {
        console.error('Error al cargar la oferta:', err);
        alert('No se pudo cargar la oferta para editarla.');
        this.router.navigate(['/offers']);
      }
    });
  }

  // Agregar un nuevo campo de requisito
  addRequirement(): void {
    this.requirements.push(this.fb.control('', Validators.required));
  }

  // Cancelar y volver a la vista principal de ofertas
  cancelAndGoBack(): void {
    this.router.navigate(['/offers']);
  }

  // Eliminar un campo de requisito por su índice
  removeRequirement(index: number): void {
    if (this.requirements.length > 1) {
      this.requirements.removeAt(index);
    }
  }

  // Enviar el formulario a MongoDB a través del servicio HTTP
  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.jobForm.value };

    // Si no es por agencia, eliminamos el objeto agency para no enviar basura
    if (!formValue.isAgency) {
      delete formValue.agency;
    }
    delete formValue.isAgency;

    const request = this.offerId
      ? this.offersService.updateOffer(this.offerId, formValue)
      : this.offersService.addOffer(formValue);

    request.subscribe({
      next: () => {
        alert(this.isEditMode ? '¡Oferta actualizada exitosamente!' : '¡Oferta creada exitosamente en MongoDB!');
        this.router.navigate(['/offers']);
      },
      error: (err) => {
        console.error('Error al guardar la oferta:', err);
        alert(this.isEditMode ? 'Hubo un error al actualizar la oferta.' : 'Hubo un error al guardar la oferta.');
      }
    });
  }
}