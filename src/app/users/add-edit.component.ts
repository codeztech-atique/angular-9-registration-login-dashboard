import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AccountService, AlertService } from "../_services";

@Component({ templateUrl: "add-edit.component.html" })
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    console.log(this.route.snapshot.params);
    this.id = this.route.snapshot.params["id"];
    this.isAddMode = !this.id;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.form = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", passwordValidators]
    });

    if (!this.isAddMode) {
      this.form.get("email").disable();
      this.accountService
        .getById(this.id)
        .pipe(first())
        .subscribe(
          x => {
            var res = JSON.parse(JSON.stringify(x));
            this.f.firstName.setValue(res.data.firstName);
            this.f.lastName.setValue(res.data.lastName);
            this.f.email.setValue(res.data.email);
          },
          err => console.log(err)
        );
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {
    this.accountService
      .register(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("User added successfully", {
            keepAfterRouteChange: true
          });
          this.router.navigate([".", { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  private updateUser() {
    this.accountService
      .update(this.id, this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Update successful", {
            keepAfterRouteChange: true
          });
          this.router.navigate(["..", { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
