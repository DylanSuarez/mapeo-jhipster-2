import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'tipo-documento',
        data: { pageTitle: 'fastasistanceApp.tipoDocumento.home.title' },
        loadChildren: () => import('./tipo-documento/tipo-documento.module').then(m => m.TipoDocumentoModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'fastasistanceApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'admin',
        data: { pageTitle: 'fastasistanceApp.admin.home.title' },
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
      },
      {
        path: 'estudiante',
        data: { pageTitle: 'fastasistanceApp.estudiante.home.title' },
        loadChildren: () => import('./estudiante/estudiante.module').then(m => m.EstudianteModule),
      },
      {
        path: 'docente',
        data: { pageTitle: 'fastasistanceApp.docente.home.title' },
        loadChildren: () => import('./docente/docente.module').then(m => m.DocenteModule),
      },
      {
        path: 'trimestre',
        data: { pageTitle: 'fastasistanceApp.trimestre.home.title' },
        loadChildren: () => import('./trimestre/trimestre.module').then(m => m.TrimestreModule),
      },
      {
        path: 'horario',
        data: { pageTitle: 'fastasistanceApp.horario.home.title' },
        loadChildren: () => import('./horario/horario.module').then(m => m.HorarioModule),
      },
      {
        path: 'regional',
        data: { pageTitle: 'fastasistanceApp.regional.home.title' },
        loadChildren: () => import('./regional/regional.module').then(m => m.RegionalModule),
      },
      {
        path: 'centro-de-formacion',
        data: { pageTitle: 'fastasistanceApp.centroDeFormacion.home.title' },
        loadChildren: () => import('./centro-de-formacion/centro-de-formacion.module').then(m => m.CentroDeFormacionModule),
      },
      {
        path: 'clase',
        data: { pageTitle: 'fastasistanceApp.clase.home.title' },
        loadChildren: () => import('./clase/clase.module').then(m => m.ClaseModule),
      },
      {
        path: 'programa-de-formacion',
        data: { pageTitle: 'fastasistanceApp.programaDeFormacion.home.title' },
        loadChildren: () => import('./programa-de-formacion/programa-de-formacion.module').then(m => m.ProgramaDeFormacionModule),
      },
      {
        path: 'ficha',
        data: { pageTitle: 'fastasistanceApp.ficha.home.title' },
        loadChildren: () => import('./ficha/ficha.module').then(m => m.FichaModule),
      },
      {
        path: 'clase-ficha',
        data: { pageTitle: 'fastasistanceApp.claseFicha.home.title' },
        loadChildren: () => import('./clase-ficha/clase-ficha.module').then(m => m.ClaseFichaModule),
      },
      {
        path: 'clase-programa-de-formacion',
        data: { pageTitle: 'fastasistanceApp.claseProgramaDeFormacion.home.title' },
        loadChildren: () =>
          import('./clase-programa-de-formacion/clase-programa-de-formacion.module').then(m => m.ClaseProgramaDeFormacionModule),
      },
      {
        path: 'clase-docente',
        data: { pageTitle: 'fastasistanceApp.claseDocente.home.title' },
        loadChildren: () => import('./clase-docente/clase-docente.module').then(m => m.ClaseDocenteModule),
      },
      {
        path: 'estudiante-horario',
        data: { pageTitle: 'fastasistanceApp.estudianteHorario.home.title' },
        loadChildren: () => import('./estudiante-horario/estudiante-horario.module').then(m => m.EstudianteHorarioModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
