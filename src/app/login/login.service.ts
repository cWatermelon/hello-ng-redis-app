import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../constants/constants.enum';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '../store/store.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginType, Response } from '../types/index.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly message: NzMessageService,
    private readonly store: StoreService
  ) {}

  login(data: LoginType) {
    return this.http
      .post<Response<{ accessToken: string }>>(environment.apiUrl + '/api/v1/redis/login', data)
      .subscribe(val => {
        if (val.statusCode === 200 && val.data) {
          sessionStorage.setItem(Constants.LOGIN_USER_NAME, data.name);
          sessionStorage.setItem(Constants.USER_TOKEN, val.data.accessToken);
          this.store.setSelectDb(data.db);
          setTimeout(() => this.router.navigateByUrl(Constants.LOGIN_SUCCESS_REDIRECT_URL), 1000);
        } else {
          this.message.error('登录失败!');
        }
      });
  }
}
