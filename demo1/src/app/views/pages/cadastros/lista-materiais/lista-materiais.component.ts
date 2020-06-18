import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { QueryParamsModel } from './../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-lista-materiais',
  templateUrl: './lista-materiais.component.html',
  styleUrls: ['./lista-materiais.component.scss']
})
export class ListaMateriaisComponent implements OnInit {

  constructor(private router: Router,private activatedRoute: ActivatedRoute,) { }

  // Table fields
	dataSource: [];
	displayedColumns = ['select', 'id', 'username', 'email', 'fullname', '_roles', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<any>(true, []);
  
  ngOnInit(): void {
  }

  adicionar() {
		this.router.navigateByUrl('materiais/edicao', { relativeTo: this.activatedRoute });
	}

}
