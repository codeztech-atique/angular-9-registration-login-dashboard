import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";

import { AccountService, AlertService } from "../_services";

@Component({ templateUrl: "list.component.html" })
export class ListComponent implements OnInit {
  users = null;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.accountService
      .getAll()
      .pipe(first())
      .subscribe(users => {
        var res = JSON.parse(JSON.stringify(users));
        this.users = res.data;
      });
  }

  deleteUser(id: string) {
    const user = this.users.find(x => x._id === id);
    user.isDeleting = true;
    this.accountService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.alertService.clear();
        this.users = this.users.filter(x => x._id !== id);
        this.alertService.success("User Delete successful", {
          keepAfterRouteChange: false
        });
      });
  }
}
