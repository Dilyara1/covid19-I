import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { User } from "../models/user";
import { ThemeService } from "../services/theme.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User;
  constructor(public authService: AuthService,
              public themeService: ThemeService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.user = user;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
