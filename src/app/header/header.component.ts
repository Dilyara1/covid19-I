import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {User} from "../models/user";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.user = user;
  }
}
