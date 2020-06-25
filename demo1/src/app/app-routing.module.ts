// Angular
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Components
import {BaseComponent} from './views/theme/base/base.component';
import {ErrorPageComponent} from './views/theme/content/error-page/error-page.component';
// Auth
import {AuthGuard} from './core/auth';
import { ListaMateriaisComponent } from './views/pages/cadastros/lista-materiais/lista-materiais.component';
import { CadastroMateriaisComponent } from './views/pages/cadastros/cadastro-materiais/cadastro-materiais.component';
import { ListaSaidasComponent } from './views/pages/cadastros/lista-saidas/lista-saidas.component';
import { CadastroSaidasComponent } from './views/pages/cadastros/cadastro-saidas/cadastro-saidas.component';
import { ListaEntradasComponent } from './views/pages/cadastros/lista-entradas/lista-entradas.component';
import { CadastroEntradasComponent } from './views/pages/cadastros/cadastro-entradas/cadastro-entradas.component';

const routes: Routes = [
	{path: 'auth', loadChildren: () => import('app/views/pages/auth/auth.module').then(m => m.AuthModule)},

	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
			},
			{
				path: 'materiais',
				component: ListaMateriaisComponent,
			},
			{
				path: 'materiais/edicao/:id',
				component: CadastroMateriaisComponent,
			},
			{
				path: 'materiais/edicao',
				component: CadastroMateriaisComponent,
			},
			{
				path: 'saidas',
				component: ListaSaidasComponent,
			},
			{
				path: 'saidas/edicao/:id',
				component: CadastroSaidasComponent,
			},
			{
				path: 'entradas',
				component: ListaEntradasComponent,
			},
			{
				path: 'entradas/edicao/:id',
				component: CadastroEntradasComponent,
			},
			{
				path: 'mail',
				loadChildren: () => import('app/views/pages/apps/mail/mail.module').then(m => m.MailModule),
			},
			{
				path: 'ecommerce',
				loadChildren: () => import('app/views/pages/apps/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
			},
			{
				path: 'ngbootstrap',
				loadChildren: () => import('app/views/pages/ngbootstrap/ngbootstrap.module').then(m => m.NgbootstrapModule),
			},
			{
				path: 'material',
				loadChildren: () => import('app/views/pages/material/material.module').then(m => m.MaterialModule),
			},
			{
				path: 'user-management',
				loadChildren: () => import('app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule),
			},
			{
				path: 'wizard',
				loadChildren: () => import('app/views/pages/wizard/wizard.module').then(m => m.WizardModule),
			},
			{
				path: 'builder',
				loadChildren: () => import('app/views/theme/content/builder/builder.module').then(m => m.BuilderModule),
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator',
				},
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
		],
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {
}
