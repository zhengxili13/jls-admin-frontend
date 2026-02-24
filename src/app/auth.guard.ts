import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router) {

    
  }

  canActivate(){
    var token = localStorage.getItem('jwt');
    var refreshToken = localStorage.getItem('refreshToken');

    if(token==null || refreshToken==null){
      this.router.navigate(['pages']);
    }
    return token!=null && refreshToken!=null;
}
}
