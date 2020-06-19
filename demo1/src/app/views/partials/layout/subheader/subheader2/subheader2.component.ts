// Angular
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Layout
import { SubheaderService, TranslationService, PageConfigService } from '../../../../../core/_base/layout';
import { Breadcrumb } from '../../../../../core/_base/layout/services/subheader.service';
import { PageConfig } from '../../../../../core/_config/page.config';

@Component({
	selector: 'kt-subheader2',
	templateUrl: './subheader2.component.html',
	styleUrls: ['./subheader2.component.scss']
})
export class Subheader2Component implements OnInit, OnDestroy, AfterViewInit {
	// Public properties
	@Input() fluid: boolean;
	@Input() clear: boolean;

	today: number = Date.now();
	title = '';
	desc = '';
	breadcrumbs: Breadcrumb[] = [];

	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		public subheaderService: SubheaderService,
		private translationService: TranslationService,
		private pageConfigService: PageConfigService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	}

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
		this.translationService.getTranslate().onLangChange.subscribe((e)=>{
			this.pageConfigService.loadConfigs(new PageConfig().configs);
			this.traduzirSubHeader();			
		});
		this.traduzirSubHeader();	
	}

	traduzirSubHeader(){
		this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
			// breadcrumbs title sometimes can be undefined
			if (bt) {
				Promise.resolve(null).then(() => {
					this.translationService.traduzir(bt.title,{}).subscribe((val)=>{
						this.title = val;
					});
					if(bt?.desc){
						this.translationService.traduzir(bt?.desc,{}).subscribe((val)=>{
							this.desc = val;
						});
					}
				});
			}
		}));

		this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
			Promise.resolve(null).then(() => {
				this.breadcrumbs = bc;
			});
		}));
	}
	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
