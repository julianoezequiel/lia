import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatPaginator, MatSort } from "@angular/material";
import {
	QueryParamsModel,
	LayoutUtilsService,
	MessageType,
} from "./../../../../core/_base/crud";
import { SelectionModel } from "@angular/cdk/collections";
import { Router, ActivatedRoute } from "@angular/router";
import { MaterialService } from "../services/material.service";
import { Material } from "../model/material.model";
import { BehaviorSubject, Observable, from, Subject } from "rxjs";
import { nextTick } from "process";

@Component({
	selector: "kt-lista-materiais",
	templateUrl: "./lista-materiais.component.html",
	styleUrls: ["./lista-materiais.component.scss"],
})
export class ListaMateriaisComponent implements OnInit {
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private materialService: MaterialService,
		private layoutUtilsService: LayoutUtilsService
	) {}

	loading: Subject<boolean>;

	// Table fields
	dataSource: any[];
	displayedColumns = [
		"descricao",
		"valor_entrada",
		"valor_saida",
		"quantidade",
		"tipo",
		"acoes"
	];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild("sort1", { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild("searchInput", { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<any>(true, []);
	isCarregando: boolean = true;

	async ngOnInit() {
  
    this.loading = new Subject<boolean>();

		this.loading.subscribe((sub) => {
			this.isCarregando = sub;
		});

		this.loading.next(true);
		this.materialService.read_todos().subscribe((data) => {
      this.dataSource = data.map((e) => {
        return {
          _id: e.payload.doc.id,
          isEdit: false,
          descricao: e.payload.doc.data()["descricao"],
          metrica: e.payload.doc.data()["metrica"],
		  quantidade: e.payload.doc.data()["quantidade"],
		  valor_entrada:e.payload.doc.data()["valor_entrada"],
		  valor_saida:e.payload.doc.data()["valor_saida"]

        };
      });
    });

	this.loading.next(false);
	}

	adicionar() {
		this.router.navigate(["../materiais/edicao", ""], {
			relativeTo: this.activatedRoute,
		});
	}

	editar(id) {
		this.router.navigate(["../materiais/edicao", id], {
			relativeTo: this.activatedRoute,
		});
	}

	excluir(_item: Material) {
		const _title = "Exluir material";
		const _description =
			"Você tem certeza em excluir permanantemente o material?";
		const _waitDesciption = "Material sendo excluido...";
		const _deleteMessage = `Material excluido`;

		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this.materialService.delete_material(_item._id).then(() => {
				this.layoutUtilsService.showActionNotification(
					_deleteMessage,
					MessageType.Delete
				);
			});
		});
	}
}
