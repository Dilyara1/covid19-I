import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
  private isDarkTheme = false;
  private prefersDark: any;

  constructor() {
  }

  public setThemeOnInit(): void {
    const theme = localStorage.getItem('theme');
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // first time app loaded check system preference
    if (!theme) {
      this.setTheme(this.prefersDark.matches);
    } else {
      if (theme === Theme.Dark) {
        this.setTheme(true);
      } else if (theme === Theme.Light) {
        this.setTheme(false);
      }
    }
    this.prefersDark.addListener((ev: any) => {
      this.setTheme(ev.matches);
    });
  }

  public toggleTheme(): any {
    this.isDarkTheme = !this.isDarkTheme;
    this.setTheme(this.isDarkTheme);
    return this.isDarkTheme ? Theme.Dark : Theme.Light;
  }

  setTheme(state: boolean): void {
    this.isDarkTheme = state;
    const theme = this.isDarkTheme ? Theme.Dark : Theme.Light;
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('theme-dark', this.isDarkTheme);
  }
}


export const Theme = {
  Dark: 'dark',
  Light: 'light'
};
