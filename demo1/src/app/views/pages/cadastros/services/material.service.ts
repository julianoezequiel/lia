import { Injectable } from '@angular/core';
import { DocumentReference, QueryDocumentSnapshot, AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Material } from '../model/material.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';
import { map } from 'rxjs/internal/operators/map';

export interface Item {
    id: string;
    ref: DocumentReference;
    data: Material;
  }
  
@Injectable({
    providedIn: 'root'
  })
export class MaterialService{

  private itemsSubject: BehaviorSubject<Item[] | undefined> =  new BehaviorSubject(undefined);
  private lastPageReached: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private nextQueryAfter: QueryDocumentSnapshot<Material>;

  private paginationSub: Subscription;
  private findSub: Subscription;

  constructor(private firestore: AngularFirestore){}
  
  collectionName = 'Materiais';

  create_material(record:Material) {
    console.log(record);
    return this.firestore.collection(this.collectionName).add(record);
  }

  update_material(recordID, record:Material) {
   return this.firestore.collection(this.collectionName).doc(recordID).update(record);    
  }

  read_material(recordID):AngularFirestoreDocument<Material> {
    return this.firestore.collection(this.collectionName).doc(recordID);
  }

  read_students() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  read_todos() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  delete_material(record_id) {
    return this.firestore.collection(this.collectionName).doc(record_id).delete();
  }

  private unsubscribe() {
    if (this.paginationSub) {
      this.paginationSub.unsubscribe();
    }

    if (this.findSub) {
      this.findSub.unsubscribe();
    }
  }

  watchItems(): Observable<Item[]> {
    return this.itemsSubject.asObservable();    
  }

  unWatchItems(){
    this.itemsSubject =  new BehaviorSubject(undefined);
    this.lastPageReached = new BehaviorSubject(false);
    this.unsubscribe();
    delete this.nextQueryAfter;
  }

  watchLastPageReached(): Observable<boolean> {
    return this.lastPageReached.asObservable();
  }

  find() {
    try {
      const collection: AngularFirestoreCollection<Material> = this.getCollectionQuery();
  
      this.unsubscribe();
  
      this.paginationSub = collection.get()
                           .subscribe(async (first) => {
        this.nextQueryAfter = first.docs[first.docs.length - 1] as          
                              QueryDocumentSnapshot<Material>;
  
        await this.query(collection);
      });
    } catch (err) {
      throw err;
    }
  }
  
  private getCollectionQuery(): AngularFirestoreCollection<Material> {
    if (this.nextQueryAfter) {
      return this.firestore.collection<Material>(this.collectionName,ref => 
          ref
           .orderBy('Age', 'asc')
               .startAfter(this.nextQueryAfter)
               .limit(5));
    } else {
      return this.firestore.collection<Material>(this.collectionName,ref =>
             ref
             .orderBy('Age', 'asc')
               .limit(5));
    }
  }

  private query(collection: AngularFirestoreCollection<Material>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.findSub = collection.snapshotChanges().pipe(map(actions => {
            return actions.map(a => {
              const data: Material =  a.payload.doc.data() as Material;
              const id = a.payload.doc.id;
              const ref = a.payload.doc.ref;
  
              return {
                id,
                ref,
                data
              };
            });
          })
        ).subscribe(async (items: Item[]) => {
          await this.addItems(items);
  
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  
  private addItems(items: Item[]): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!items || items.length <= 0) {
        this.lastPageReached.next(true);
  
        resolve();
        return;
      }
      this.itemsSubject.asObservable().pipe(take(1))
                       .subscribe((currentItems: Item[]) => {
        this.itemsSubject.next(currentItems !== undefined ? 
              [...currentItems, ...items] : [...items]);
  
        resolve();
      });
    });
  }
}