// Angular
import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from "@angular/router";
// RxJS
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
// NGRX
import { select, Store } from "@ngrx/store";
// Auth reducers and selectors
import { AppState } from "../../../core/reducers/";
import { isLoggedIn } from "../_selectors/auth.selectors";
import { AuthService } from "../_services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(public authService: AuthService, public router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		if (this.authService.isLoggedIn !== true) {
			this.router.navigateByUrl("/auth/login");
		}
		return true;
	}
}
