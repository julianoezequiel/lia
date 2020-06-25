// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MailModule } from './apps/mail/mail.module';
import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
import { UserManagementModule } from './user-management/user-management.module';
import { MyPageComponent } from './my-page/my-page.component';
import { ListaMateriaisComponent } from './cadastros/lista-materiais/lista-materiais.component';
import { CadastroMateriaisComponent } from './cadastros/cadastro-materiais/cadastro-materiais.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, MatMenuModule, MatSelectModule, MatInputModule, MatTableModule, MatAutocompleteModule, MatRadioModule, MatIconModule, MatNativeDateModule, MatProgressBarModule, MatDatepickerModule, MatCardModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule, MatTabsModule, MatTooltipModule, MatDialogModule } from '@angular/material';
import { ListaSaidasComponent } from './cadastros/lista-saidas/lista-saidas.component';
import { CadastroSaidasComponent } from './cadastros/cadastro-saidas/cadastro-saidas.component';
import { ListaEntradasComponent } from './cadastros/lista-entradas/lista-entradas.component';
import { CadastroEntradasComponent } from './cadastros/cadastro-entradas/cadastro-entradas.component';

@NgModule({
	declarations: [MyPageComponent, CadastroMateriaisComponent, ListaMateriaisComponent, ListaSaidasComponent, CadastroSaidasComponent, ListaEntradasComponent, CadastroEntradasComponent],
	exports: [CadastroMateriaisComponent, ListaMateriaisComponent],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		MailModule,
		ECommerceModule,
		UserManagementModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule
	],
	providers: [CadastroMateriaisComponent, ListaMateriaisComponent]
})
export class PagesModule {
}
