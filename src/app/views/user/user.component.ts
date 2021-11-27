import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { concatMap, finalize } from "rxjs/operators";
import { User } from "../../services/auth/auth.service";
import { ToastService } from "../../services/toast/toast.service";
import { UserDatabase, UsersService } from "../../services/users/users.service";
import {
  acountUser,
  countryCode,
  paymentMethods,
  statusUser,
  transformCountry,
} from "./variablesUser";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit, OnDestroy {
  localStoreUser: User;

  isLoading = false;
  error: string = null;
  profileForm: FormGroup;

  previewUrl: string | ArrayBuffer;
  fileInput: File;

  items: { Code: string; Name: string }[] = transformCountry(countryCode);
  paymentMethods = paymentMethods;
  statusUser = statusUser;
  acountUser = acountUser
  userDatabase: UserDatabase;
  filePath: string;
  // unsubscribe
  userDatabaseSub: Subscription;
  usersServiceSub: Subscription;
  uploadFileAndUpdateUserSub: Subscription;
  updateUserSub: Subscription;
  storageSub: Subscription;
  //
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private storage: AngularFireStorage,
    public sanitizer: DomSanitizer,
    public toastService: ToastService
  ) {
    this.localStoreUser = JSON.parse(localStorage.getItem("userData"));
    this.filePath = `avatars/${this.localStoreUser.email}`;
  }
  ngOnInit() {
    this.usersServiceSub =
      this.usersService.currentUserDatabaseSubject.subscribe(
        (userDatabase: UserDatabase) => {
          this.userDatabase = userDatabase;
          this.previewUrl = this.userDatabase ? this.userDatabase.avatar : "";
          this.buildForm();
        }
      );
    this.buildForm();
  }

  buildForm() {
    this.profileForm = this.fb.group({
      avatar: [null],
      status: [this.userDatabase?.status ?? statusUser[0]],
      username: [this.userDatabase?.displayName ?? ""],
      country: [this.userDatabase?.country ?? ""],
      paymentMethod: [this.userDatabase?.paymentMethod ?? ""],
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.fileInput = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => {
        this.previewUrl = event.target.result; // called once readAsDataURL is completed
      };
    }
  }

  onSubmit(form: FormGroup) {
    const newUser: UserDatabase = {
      ...this.userDatabase,
      displayName: form.value.username,
      country: form.value.country,
      paymentMethod: form.value.paymentMethod,
      status: form.value.status,
    };
    if (this.fileInput) {
      this.uploadFileAndUpdateUserSub = this.uploadFileAndUpdateUser(
        this.fileInput,
        newUser
      );
    } else {
      this.updateUserSub = this.updateUser(newUser);
    }
  }

  uploadFileAndUpdateUser(file: File, user: UserDatabase) {
    return this.storage
      .upload(this.filePath, file)
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.storageSub = this.storage
            .ref(this.filePath)
            .getDownloadURL()
            .pipe(
              concatMap((downloadURL: any) => {
                user.avatar = downloadURL;
                return this.usersService.updateUser(
                  this.userDatabase.databaseId,
                  user
                );
              })
            )
            .subscribe((data: UserDatabase) => {
              this.showToast(
                "Save Profile Finish",
                "bg-success",
                "toast-bottom-right"
              );
              this.usersService.currentUserDatabaseSubject.next(data);
              this.buildForm();
            });
        })
      )
      .subscribe();
  }

  updateUser(user: UserDatabase) {
    return this.usersService
      .updateUser(this.userDatabase.databaseId, user)
      .subscribe((data: UserDatabase) => {
        this.showToast(
          "Save Profile Finish",
          "bg-success",
          "toast-bottom-right"
        );
        this.usersService.currentUserDatabaseSubject.next(data);
        this.buildForm();
      });
  }

  showToast(mess: string, style: string, position: string) {
    this.toastService.show(mess, {
      classname: `${style} text-light ${position}`,
    });
  }

  onReset() {
    this.buildForm();
    this.previewUrl = this.userDatabase.avatar;
  }

  style(data: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(data);
  }

  ngOnDestroy() {
    this.usersServiceSub && this.usersServiceSub.unsubscribe();
    this.uploadFileAndUpdateUserSub &&
      this.uploadFileAndUpdateUserSub.unsubscribe();
    this.updateUserSub && this.updateUserSub.unsubscribe();
    this.storageSub && this.storageSub.unsubscribe();
  }
}
