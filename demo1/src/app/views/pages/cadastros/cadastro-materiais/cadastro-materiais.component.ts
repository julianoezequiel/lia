import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { Material } from '../model/material.model';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Metrica } from '../model/metrica.model';
import { MaterialService } from '../services/material.service';
import { result } from 'lodash';

@Component({
	selector: "kt-cadastro-materiais",
	templateUrl: "./cadastro-materiais.component.html",
	styleUrls: ["./cadastro-materiais.component.scss"],
})
export class CadastroMateriaisComponent implements OnInit {
	titulo: BehaviorSubject<string> = new BehaviorSubject<string>("");
	// Public properties
	material: Material;
	materialId$: Observable<number>;
	oldMaterial: Material;
	selectedTab = 0;
	loading$: Observable<boolean>;
	metricaSubject = new BehaviorSubject<Metrica>({ _id: null, descricao: "" });
	metricas: Metrica[] = [
		{
			_id: 1,
			descricao: "Kg",
		},
		{
			_id: 2,
			descricao: "M²",
		},
	];
	userForm: FormGroup;
	hasFormErrors = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private materialService: MaterialService
	) {}

	ngOnInit() {
		this.material = {
			_id: null,
			descricao: "",
			metrica: {
				_id: null,
				descricao: "",
			},
			quantidade: 0,
		};
		this.metricaSubject.next(this.material.metrica);
		this.oldMaterial = Object.assign({}, this.material);
		this.initMaterial();

	 const routeSubscription = this.activatedRoute.params.subscribe(
			(params) => {
				const id = params.id;
				if (id && id.length > 0) {
					const material = this.materialService
						.read_material(id)
						.valueChanges();
					material.subscribe((value) => {
						this.material = value;
						this.titulo.next(`Editar - ${this.material.descricao}`)	;		
						this.initMaterial();
					});						
				} else{
					this.titulo.next("Novo");
				}
			}
		);
		this.subscriptions.push(routeSubscription);
	}

	initMaterial() {
		this.createForm();
		if (!this.material._id) {
			this.subheaderService.setTitle("Novo");
			this.subheaderService.setBreadcrumbs([
				{ title: "Cadastros", page: `user-management` },
				{ title: "Materiais", page: `user-management/users` },
				{ title: "Novo material", page: `user-management/users/add` },
			]);
			return;
		}
		this.subheaderService.setTitle("Editar");
		this.subheaderService.setBreadcrumbs([
			{ title: "Cadastros", page: `user-management` },
			{ title: "Materiais", page: `user-management/users` },
			{
				title: "Ediatr material",
				page: `user-management/users/edit`,
				queryParams: { id: this.material._id },
			},
		]);
	}

	/**
	 * Reset
	 */
	reset() {
		this.material = Object.assign({}, this.oldMaterial);
		this.createForm();
		this.hasFormErrors = false;
		this.userForm.markAsPristine();
		this.userForm.markAsUntouched();
		this.userForm.updateValueAndValidity();
	}

	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.userForm.controls;
		/** check form */
		if (this.userForm.invalid) {
			Object.keys(controls).forEach((controlName) =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const material = this.prepareMaterial();

		if (material._id) {
			this.updatematerial(material, withBack);
			return;
		}

		this.addMaterial(material, withBack);
	}

	prepareMaterial(): Material {
		const controls = this.userForm.controls;
		const material: Material = {
			descricao: controls.descricao.value,
			metrica: controls.metrica.value,
			quantidade: controls.quantidade.value,
			_id: controls._id.value,
		};

		return material;
	}

	updatematerial(m: Material, withBack: boolean) {
		this.materialService.update_material(m._id, m).then((result) => {
			const message = `User successfully has been saved.`;
			this.layoutUtilsService.showActionNotification(
				message,
				MessageType.Update,
				5000,
				true,
				true
			);
			this.refreshMaterial(true, m._id);
			console.log(result);
		});
	}

	addMaterial(m: Material, withBack: boolean) {
		this.materialService.create_material(m).then((result) => {
			const message = `New user successfully has been added.`;
			this.layoutUtilsService.showActionNotification(
				message,
				MessageType.Create,
				5000,
				true,
				true
			);
			this.refreshMaterial(true, result.id);
			console.log(result);
		});
	}

	refreshMaterial(isNew: boolean = false, id = "0") {
		// let url = this.router.url;
		// if (!isNew) {
		// 	this.router.navigate([url], { relativeTo: this.activatedRoute });
		// 	return;
		// }

		// url = `/cadastro/edicao/${id}`;
		this.router.navigateByUrl("materiais", {
			relativeTo: this.activatedRoute,
		});
	}

	createForm() {
		this.userForm = this.userFB.group({
			descricao: [this.material.descricao, Validators.required],
			metrica: [this.material?.metrica?._id, Validators.required],
			quantidade: [this.material.quantidade],
			_id: [this.material._id],
		});
	}
	/**
	 * Returns component title
	 */
	getComponentTitle() : Observable<string>{
	 	return	this.titulo.asObservable();		
	}

	voltar(){
		this.router.navigate(['materiais']);
	}
}
