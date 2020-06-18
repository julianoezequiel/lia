import { Injectable,NgZone  } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { User } from "../_models/user.model";
import { Permission } from "../_models/permission.model";
import { Role } from "../_models/role.model";
import { catchError, map } from "rxjs/operators";
import { QueryParamsModel, QueryResultsModel } from "../../_base/crud";
import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";

import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserFirebase } from '../_models/userfirebase.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { Login } from '../_actions/auth.actions';

const API_USERS_URL = environment.baseUrl + "/restrict/user";
const API_PERMISSION_URL = environment.baseUrl + "/permissions";
const API_ROLES_URL = environment.baseUrl + "/roles";
const API_AUTH = environment.baseUrl + "/auth";

@Injectable()
export class AuthService {
	userData: any; // Save logged in user data
	constructor(
		private http: HttpClient,
		public afs: AngularFirestore,   // Inject Firestore service
		public afAuth: AngularFireAuth, // Inject Firebase auth service
		public router: Router,  
		public ngZone: NgZone, // NgZone service to remove outside scope warning) {},
		private store: Store<AppState>,
	){
		/* Saving user data in localstorage when 
		logged in and setting up null when logged out */
		this.afAuth.authState.subscribe(user => {
			if (user) {
			this.userData = user;
			localStorage.setItem('user', JSON.stringify(this.userData));
			JSON.parse(localStorage.getItem('user'));
			} else {
			localStorage.setItem('user', null);
			JSON.parse(localStorage.getItem('user'));
			}
		})
	}
	// Authentication/Authorization
	login(email: string, password: string): Observable<User> {
		return this.http.post<User>(API_AUTH, { email, password });
	}

	getUserByToken(): Observable<User> {		
		return Observable.create(observe=>{
			let user : User = JSON.parse(localStorage.getItem('user'));
			observe.next(user);
			observe.complete();
		});
	}

	register(user: User): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "application/json");
		return this.http
			.post<User>(API_USERS_URL, user, { headers: httpHeaders })
			.pipe(
				map((res: User) => {
					return res;
				}),
				catchError((err) => {
					return null;
				})
			);
	}

	/*
	 * Submit forgot password request
	 *
	 * @param {string} email
	 * @returns {Observable<any>}
	 */
	public requestPassword(email: string): Observable<any> {
		return this.http
			.get(API_USERS_URL + "/forgot?=" + email)
			.pipe(catchError(this.handleError("forgot-password", [])));
	}

	getAllUsers(): Observable<User[]> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		let httpHeaders = new HttpHeaders();
		httpHeaders.append("Authorization", "Bearer " + userToken);
		return this.http.get<User[]>(API_USERS_URL, { headers: httpHeaders });
	}

	getUserById(userId: number): Observable<User> {
		return this.http.get<User>(API_USERS_URL + `/${userId}`);
	}

	// DELETE => delete the user from the server
	deleteUser(userId: number) {
		const url = `${API_USERS_URL}/${userId}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the user on the server
	updateUser(_user: User): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "application/json");
		return this.http.put(API_USERS_URL, _user, { headers: httpHeaders });
	}

	// CREATE =>  POST: add a new user to the server
	createUser(user: User): Observable<User> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "application/json");
		return this.http.post<User>(API_USERS_URL, user, {
			headers: httpHeaders,
		});
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set("Content-Type", "application/json");
		return this.http.post<QueryResultsModel>(
			API_USERS_URL + "/findUsers",
			queryParams,
			{ headers: httpHeaders }
		);
	}

	// Permission
	getAllPermissions(): Observable<Permission[]> {
        let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set("Content-Type", "application/json");
		return this.http.get<Permission[]>(API_PERMISSION_URL,{
			headers: httpHeaders
		});
	}

	getRolePermissions(roleId: number): Observable<Permission[]> {
        let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set("Content-Type", "application/json");
		return this.http.get<Permission[]>(
			API_PERMISSION_URL + "/getRolePermission?=" + roleId
		);
	}

	// Roles
	getAllRoles(): Observable<Role[]> {
        let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set("Content-Type", "application/json");
		return this.http.get<Role[]>(API_ROLES_URL,{
			headers: httpHeaders
		});
	}

	getRoleById(roleId: number): Observable<Role> {
		return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
	}

	// CREATE =>  POST: add a new role to the server
	createRole(role: Role): Observable<Role> {
		// Note: Add headers if needed (tokens/bearer)
		let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set("Content-Type", "application/json");
		return this.http.post<Role>(API_ROLES_URL, role, {
			headers: httpHeaders,
		});
	}

	// UPDATE => PUT: update the role on the server
	updateRole(role: Role): Observable<any> {
		let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set("Content-Type", "application/json");
		return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
	}

	// DELETE => delete the role from the server
	deleteRole(roleId: number): Observable<Role> {
		const url = `${API_ROLES_URL}/${roleId}`;
		return this.http.delete<Role>(url);
	}

	// Check Role Before deletion
	isRoleAssignedToUsers(roleId: number): Observable<boolean> {
		return this.http.get<boolean>(
			API_ROLES_URL + "/checkIsRollAssignedToUser?roleId=" + roleId
		);
	}

	findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set("Content-Type", "application/json");
		return this.http.post<QueryResultsModel>(
			API_ROLES_URL + "/findRoles",
			queryParams,
			{ headers: httpHeaders }
		);
	}

	/*
	 * Handle Http operation that failed.
	 * Let the app continue.
	 *
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result);
		};
	}

	//################################################################

	 // Sign in with email/password
	 SignIn(email, password) {
		return this.afAuth.signInWithEmailAndPassword(email, password)
		  .then((result) => {
			this.ngZone.run(() => {
			  this.router.navigate(['dashboard']);
			});
			this.SetUserData(result.user);
		  }).catch((error) => {
			window.alert(error.message)
		  })
	  }
	
	  // Sign up with email/password
	  SignUp(email, password) {
		return this.afAuth.createUserWithEmailAndPassword(email, password)
		  .then((result) => {
			/* Call the SendVerificaitonMail() function when new user sign 
			up and returns promise */
			this.SendVerificationMail();
			this.SetUserData(result.user);
		  }).catch((error) => {
			window.alert(error.message)
		  })
	  }
	
	  // Send email verfificaiton when new user sign up
	  SendVerificationMail() {
		return this.afAuth.currentUser.then((u)=>{
			u.sendEmailVerification();
			this.router.navigate(['verify-email-address']);
		})
	 }
	
	  // Reset Forggot password
	  ForgotPassword(passwordResetEmail) {
		return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
		.then(() => {
		  window.alert('Password reset email sent, check your inbox.');
		}).catch((error) => {
		  window.alert(error)
		})
	  }	
	
	  // Returns true when user is looged in and email is verified
	  get isLoggedIn(): boolean {
		const user = JSON.parse(localStorage.getItem('user'));
		return (user !== null && user.emailVerified !== false) ? true : false;
	  }
	
	  // Sign in with Google
	  GoogleAuth() {
		return this.AuthLogin(new auth.GoogleAuthProvider());
	  }
	
	  // Auth logic to run auth providers
	  AuthLogin(provider) {
		return this.afAuth.signInWithPopup(provider)
		.then((result) => {
		  this.SetUserData(result.user);
		  let user = result.user;
		  localStorage.setItem('user', JSON.stringify(user));
		  this.store.dispatch(new Login({authToken: user.getIdToken.toString()}));
		//   this.ngZone.run(() => {
			this.router.navigate(['dashboard']);
		//   });
		}).catch((error) => {
		  window.alert(error)
		})
	  }
	
	  /* Setting up user data when sign in with username/password, 
	  sign up with username/password and sign in with social auth  
	  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
	  SetUserData(user) {
		const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
		const userData: UserFirebase = {
		  uid: user.uid,
		  email: user.email,
		  displayName: user.displayName,
		  photoURL: user.photoURL,
		  emailVerified: user.emailVerified
		}
		
		return userRef.set(userData, {
		  merge: true
		})
		
	  }
	
	  // Sign out 
	  SignOut() {
		return this.afAuth.signOut().then(() => {
		  localStorage.removeItem('user');
		  this.router.navigate(['sign-in']);
		})
	  }
}
