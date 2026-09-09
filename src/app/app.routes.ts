import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'offers',
    pathMatch: 'full'
  },
  {
    path: 'offers',
    loadComponent: () => import('./features/offers/pages/offer-list/offer-list')
      .then(m => m.OfferListComponent),
    title: 'Ofertas de Trabajo en Polonia'
  },
  {
    path: 'offers/:id',
    loadComponent: () => import('./features/offers/pages/offer-detail/offer-detail')
      .then(m => m.OfferDetailComponent),
    title: 'Detalle de la Oferta'
  },
  {
    path: 'agencies/:id',
    loadComponent: () => import('./features/agencias/pages/agency-detail/agency-detail')
      .then(m => m.AgencyDetail),
    title: 'Información de la Agencia'
  },
  {
    path: 'admin/post-job',
    loadComponent: () => import('./features/admin/pages/job-form/job-form')
      .then(m => m.JobFormComponent),
    title: 'Publicar una Oferta',
    canActivate: [adminGuard]
  },
  {
    path: 'admin/edit-offer/:id',
    loadComponent: () => import('./features/admin/pages/job-form/job-form')
      .then(m => m.JobFormComponent),
    title: 'Editar Oferta',
    canActivate: [adminGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register')
      .then(m => m.RegisterComponent),
    title: 'Registro de Usuario'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login')
      .then(m => m.LoginComponent),
    title: 'Iniciar Sesión'
  },
  {
    path: '**',
    redirectTo: 'offers' // Comodín para rutas inexistentes
  }
];