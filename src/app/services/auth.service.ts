import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GithubAuthProvider } from '@angular/fire/auth';
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  userSubject = new Subject();
  userChange = this.userSubject.asObservable();
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service,
    private router: Router
  ) {
    /* Saving user data in localstorage when
        logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        console.log('now user: ', user);
        this.userData = user;
        this.setUser(user);
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  // Returns true when user is logged in and email is verified
  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.uid !== null;
  }

  // Sign in with GitHub
  GithubAuth() {
    return this.authLogin(new GithubAuthProvider()).then(() => {});
  }

  getAuthProvider(provider: string): any {
    return new GithubAuthProvider();
  }

  // Auth logic to run auth providers
  authLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.setUserData(result.user).then(() => {
          this.router.navigate(['covid-info']);
        });
      })
      .catch(error => {

        const code = error.code;
        const credential = error.credential;
        console.log(code);
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      insertTime: new Date().toISOString(),
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out
  onSignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}
