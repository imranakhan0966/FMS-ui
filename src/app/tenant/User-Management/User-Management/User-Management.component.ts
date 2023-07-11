import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { CountryService } from "@shared/Services/country-service";
import { StateService } from "@shared/Services/state-service";
import { CityService } from "@shared/Services/City-Service";

import { CountryModel } from "@shared/Dto/country-model";
import { StateModel } from "@shared/Dto/state-model";
import { CityModel } from "@shared/Dto/city-model";
import {
  FilterOperator,
  ParamMethod,
  QueryParamModel,
} from "@shared/interface/QueryParam.interface";
import { Router } from "@angular/router";
import { TenantClientService } from "@shared/Services/tenant-client.service";
import { BuildingModel } from "@shared/interface/Building.interface";
import { TenantBuildingService } from "@shared/Services/tenant-building.service";
import { SecUserService } from "@shared/Services/sec-user.service";
import { TenantUserManagementService } from "@shared/Services/tenant-user-management.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-User-Management",
  templateUrl: "./User-Management.component.html",
  styleUrls: ["./User-Management.component.css"],
})
export class UserManagementComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  public showPassword: boolean;
  public showPasswordOnPress: boolean;
  public AddNewDataForm = new FormGroup({
    
    fullName: new FormControl(""),
    lastName: new FormControl(""),
    password: new FormControl(""),
    confirmPassword: new FormControl(""),
    cityId: new FormControl(""),
    stateId: new FormControl(""),
    buildingId: new FormControl(""),
    countryId: new FormControl(""),
    telephone: new FormControl(""),
    mobile: new FormControl(""),
    email: new FormControl(""),
       });

  // DropDowns
  public CountryList: CountryModel[] = [];
  public StateList: StateModel[] = [];
  public CityList: CityModel[] = [];
  public BuildingList: BuildingModel[];
  // UserData
  private SecUserId;

  constructor(
    private router: Router,
    public CountryService: CountryService,
    public StateService: StateService,
    public CityService: CityService,
    private _tenantUser: TenantUserManagementService,
    private buildingService: TenantBuildingService,
    private _toster: ToastrService
  ) {
    this.SecUserId = +localStorage.getItem("userId");
  }

  async ngOnInit(): Promise<void> {
    this.AddNewDataForm.reset();

    this.loadCountry();
    this.loadState();
    this.loadCity();
    await this.loadBuilding();
  }
  async loadBuilding(queryParam?: QueryParamModel[]): Promise<void> {
    this.BuildingList = await this.buildingService.GetAllBuildings(queryParam);
  }

  async loadCountry(queryParam?: QueryParamModel[]): Promise<void> {
   
    this.CountryList = await this.CountryService.GetAllCountries(queryParam);
  }

  async loadState(queryParam?: QueryParamModel[]): Promise<void> {
    this.StateList = await this.StateService.GetAllStates(queryParam);
  }

  async loadCity(queryParam?: QueryParamModel[]): Promise<void> {
    this.CityList = await this.CityService.GetAllCities(queryParam);
  }
  KeyPress(event) {
    let value: string = (event.target as HTMLInputElement).value;
    if (value.length == 3) (event.target as HTMLInputElement).value += "-";
    if (value.length == 7) (event.target as HTMLInputElement).value += "-";
  }
  onCountryChange(value): void {
    const queryParam: QueryParamModel[] = [
      {
        QueryParam: "countryId",
        value,
        method: ParamMethod.FILTER,
        filterOperator: FilterOperator.EQUAL,
      },
    ];

    this.loadState(queryParam);
  }
  onBuildingChange(value): void {
    const queryParam: QueryParamModel[] = [
      {
        QueryParam: "buildingId",
        value,
        method: ParamMethod.FILTER,
        filterOperator: FilterOperator.EQUAL,
      },
    ];

    this.loadState(queryParam);
  }
  onStateChange(value): void {
    console.log(value);
    const queryParam: QueryParamModel[] = [
      {
        QueryParam: "stateId",
        value,
        method: ParamMethod.FILTER,
        filterOperator: FilterOperator.EQUAL,
      },
    ];

    this.loadCity(queryParam);
  }

  public async OnServiceRequestFormSubmit(): Promise<void> {
    if (this.AddNewDataForm.invalid) return null;
    this.AddNewDataForm.get("confirmPassword").setValue(this.AddNewDataForm.get("password").value);
    //return this._toster.error("Error, Form Invalid");
debugger;
    // const byDefault = {
     
    //   userName:"",
    //   lastName: "",
    //   fullName: "",
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    //   departmentId: null,
    //   isActive: true,
    //   roleId: 23,
    //   userTypeId: null,
    //   prefixId: null,
    //   countryId: null,
    //   cityId: null,
    //   stateId: null,
    //   buildingId: null,
    //   floorId: null,
    //   flatId: null,
    //   address1: "",
    //   address2: "",
    //   mobile: "",
    //   telephone: "",
    //   postalCode: "",
    //   dateOfBirth: "",
    //   registrationNo: "",
    //   code: "",
    //   photoFile: "",
    //   confidentialityFile: "",
    //   contractFile: "",
    //   firstName: "",
    //   organizationId: null,
    //   emailForgotPassword: "",
    //   createdBy: null,
    //   parentUserId: null,
    // };

    // const user = { ...byDefault, ...this.AddNewDataForm.value };
    const user = { ...this.AddNewDataForm.value };
    debugger;
    await this._tenantUser.CreateUser(user);
    this._toster.info("User Inserted!");
    this.router.navigate([`/app/userManagement`]);
  }
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  passwordGenerate(){
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=?<>,:;{}[]";
    let paswordLenghth = 8 ;
    let password = '';
    for(let i=0;i < paswordLenghth; i++){
      let randomNumber = Math.floor(Math.random()*chars.length);
      password +=chars.substring(randomNumber,randomNumber+1);
    }
    this.AddNewDataForm.get("password").setValue(password);
  }
}
