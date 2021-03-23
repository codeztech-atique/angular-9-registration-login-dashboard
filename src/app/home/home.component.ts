import { User } from "../_models";
import { AccountService, SharedService } from "../_services";
import { Component, Output, EventEmitter, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { HttpClient, HttpParams } from "@angular/common/http";
@Component({
  templateUrl: "home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent {
  user: User;
  private clickTimeout = null;
  private updateTimeout = null;
  userName: any;
  userMobile: any;
  tableData: any = [];
  showEditTable: boolean = false;
  editRowID: any = "";

  todoForm = this.formBuilder.group({
    name: new FormControl("", [Validators.required]),
    mobile: new FormControl("", [Validators.required])
  });

  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private shared: SharedService
  ) {
    this.user = this.accountService.userValue;
  }

  public setClickTimeout(callback) {
    // clear any existing timeout
    clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = null;
      callback();
    }, 2000);
  }

  submitData() {
    if (this.clickTimeout) {
      this.setClickTimeout(() => {});
    } else {
      // if timeout doesn't exist, we know it's first click
      // treat as single click until further notice
      this.setClickTimeout(itemId => this.handleSingleClick());
    }
  }
  public handleSingleClick() {
    // 2 sec - deboucing time
    console.log(this.todoForm.value);
    this.shared.createTodos(this.todoForm.value).subscribe(
      data => {
        const res = JSON.parse(JSON.stringify(data));
        console.log(res);
        if (res) {
          var filterData = {};
          var parseJson = res.data;
          filterData["name"] = parseJson.name;
          filterData["mobile"] = parseJson.mobile;
          filterData["id"] = parseJson.id;
          var showMessage = <HTMLElement>document.getElementById("success");
          showMessage.style.cursor = "block";

          this.ngOnInit();
        }
      },
      error => {
        var showMessage = <HTMLElement>document.getElementById("success");
        showMessage.style.cursor = "none";
        var showErMessage = <HTMLElement>document.getElementById("error");
        showErMessage.style.cursor = "block";
        console.log(error);
      }
    );
  }

  deleteSingleTodoItems(data) {
    console.log(data);
    if (confirm("Are you sure you want to delete this ?")) {
      // Save it!
      console.log(data + " delete items from database.");
      this.shared.deleteSingleTodos(data).subscribe(
        data => {
          const res = JSON.parse(JSON.stringify(data));
          if (res) {
            console.log(res);
            this.ngOnInit();
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      // Do nothing!
      console.log("Thing was not saved to the database.");
    }
  }

  ngOnInit() {
    this.tableData = [];
    this.shared.getAllTodos().subscribe(
      data => {
        const res = JSON.parse(JSON.stringify(data));
        if (res) {
          var parseJson = res.data;
          for (let i = 0; i < parseJson.length; i++) {
            this.tableData.push({
              id: parseJson[i].id,
              name: parseJson[i].name,
              mobile: parseJson[i].mobile
            });
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  Edit(val) {
    // console.log(id);
    // this.user.id = id;
    this.editRowID = val;
  }

  onKey(id, name, mobile) {
    if (this.clickTimeout) {
      this.setUpdateTimeout(() => {});
    } else {
      // if timeout doesn't exist, we know it's first click
      // treat as single click until further notice
      this.setUpdateTimeout(itemId => this.updateSingleClick(id, name, mobile));
    }
  }
  updateSingleClick(id, name, mobile) {
    var resD = {
      id: id,
      name: name,
      mobile: mobile
    };
    console.log(resD);
    this.shared.updateSingleTodos(resD).subscribe(
      data => {
        const res = JSON.parse(JSON.stringify(data));
        if (res) {
          alert(
            "UserId:" + id + "\n" + "Name:" + name + " Successfully Updated !!!"
          );
          this.ngOnInit();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public setUpdateTimeout(callback) {
    // clear any existing timeout
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
      this.updateTimeout = null;
      callback();
    }, 2000);
  }
}
