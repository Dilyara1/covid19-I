import { Component, OnInit } from '@angular/core';
import { ThemeService } from "./services/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'covid19-I';

  constructor(private themeService: ThemeService) {
  }

  ngOnInit() {
    this.themeService.setThemeOnInit();
  }
}
