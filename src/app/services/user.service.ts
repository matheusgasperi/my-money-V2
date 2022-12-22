/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import {Injectable} from '@angular/core'


interface User {
  nome?: string,
  email: string,
  uid: string
}

@Injectable()
export class UserService {
  private user: User

  constructor(){

  }

  setUser(user: User) {
    this.user = user
  }

  getUID() {
    return this.user.uid
  }
}
