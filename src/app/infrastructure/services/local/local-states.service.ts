import { Injectable } from '@angular/core';
import { Observable, Subject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStatesService {

  tokenExpiredSubject = new Subject<any>();

  constructor() { }

  getStateTokenExpiredMarker():Observable<any> {
    return this.tokenExpiredSubject.asObservable();
  }
  setStateTokenExpired(){
    this.tokenExpiredSubject.next(true);
  }

}
