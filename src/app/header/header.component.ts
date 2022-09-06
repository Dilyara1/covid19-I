import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { ThemeService } from "../services/theme.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;
  theme: any;

  constructor(public authService: AuthService,
              public themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.theme = localStorage.getItem('theme');
    this.authService.userChange.subscribe((user: any) => {
      this.user = user;
    });
  }

  toggleTheme() {
    this.theme = this.themeService.toggleTheme();
  }
}
