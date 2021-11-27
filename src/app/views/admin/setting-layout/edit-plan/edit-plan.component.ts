import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
import { concatMap } from "rxjs/operators";
import { AdminService } from "../../../../services/admin/admin.service";
import { ToastService } from "../../../../services/toast/toast.service";

export interface ThemeData {
  price: string;
  email: string;
  storage: string;
  databases: string;
  domains: string;
  support: string;
}

@Component({
  selector: "app-edit-plan",
  templateUrl: "./edit-plan.component.html",
  styleUrls: ["./edit-plan.component.scss"],
})
export class EditPlanComponent implements OnInit {
  themeForm: FormGroup;
  themeData: ThemeData;
  idTheme: string;
  idChild: string;
  index: string;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.adminService.idTheme.subscribe((data: string) => {
      this.idTheme = data;
    });
    this.adminService.idChild.subscribe((data: string) => {
      this.idChild = data;
    });
    console.log(this.route.url)
    this.route.queryParams.subscribe((data) => {
      this.index = data["index"];
    });
    this.adminService.getThemeData(this.idTheme,this.idChild,this.index).subscribe((data:any)=>{
      this.themeData = data
      this.buildForm()
    })
    this.buildForm();
  }
  buildForm() {
    this.themeForm = this.fb.group({
      price: [this.themeData?.price ?? null],
      email: [this.themeData?.email ?? null],
      storage: [this.themeData?.storage ?? null],
      databases: [this.themeData?.databases ?? null],
      domains: [this.themeData?.domains ?? null],
      support: [this.themeData?.support ?? null],
    });
  }

  showToast(mess: string, style: string, position: string) {
    this.toastService.show(mess, {
      classname: `${style} text-light ${position}`,
    });
  }
  onSubmit(form: FormGroup) {
    this.adminService.createThemeData(
      this.idTheme,
      this.idChild,
      this.index,
      form.value
    );
  }
  onReset() {
    //this.buildForm();
    this.showToast("Save Profile Finish", "bg-success", "toast-bottom-right");
  }
}
