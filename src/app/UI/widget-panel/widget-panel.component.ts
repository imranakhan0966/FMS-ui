import { Component, Input, OnInit } from "@angular/core";
import { SecUserModel } from "@app/Models/user-interface";

import { BuildingModel } from "@shared/interface/Building.interface";
import { FlatModel } from "@shared/interface/Flat.interface";
import { FloorModel } from "@shared/interface/Floor.interface";
import { StatusModel } from "@shared/interface/Status.interface";
import { ServiceRequestModel } from "@shared/interface/ServiceRequest.interface";
import {
  FilterOperator,
  ParamMethod,
  QueryParamModel,
} from "@shared/interface/QueryParam.interface";

import { TenantServicesService } from "@shared/Services/tenant-services.service";
import { TenantBuildingService } from "@shared/Services/tenant-building.service";

import {
  RoleAuthorizerUtility,
  Roles,
} from "@shared/utility/role-authorizer.utility";

import { StateCardTabModel } from "../state-card-tab/tab.interface";
import { FloorType } from "@shared/interface/FloorType.interface";
import { ParkingSlotModel } from "@shared/interface/ParkingSlot.interface";
import { TenantUserManagementService } from "@shared/Services/tenant-user-management.service";

@Component({
  selector: "UI-widget-panel",
  template: `
    <div class="row col-md-12">
      <div class="col-sm-2" *ngIf="ShowBuildingNameWidget">
        <state-card-mini
          label="Building"
          [name]="BuildingObject?.name"
          link="#"
        >
        </state-card-mini>
      </div>
      <div class="col-sm-2" *ngIf="ShowBuildingStateWidget">
        <state-card-mini label="Buildings" [state]="BuildingCount" link="#">
        </state-card-mini>
      </div>
      <div class="col-sm-2" *ngIf="ShowFloorNameWidget">
        <state-card-mini label="Floor" [name]="FloorObject?.name" link="#">
        </state-card-mini>
      </div>
      <div class="col-sm-2" *ngIf="ShowFloorStateWidget">
        <state-card-mini label="Floors" [state]="FloorCount" link="#">
        </state-card-mini>
      </div>
      <div class="col-sm-2" *ngIf="ShowFlatNameWidget">
        <state-card-mini label="Apartment" [name]="FlatObject?.name" link="#">
        </state-card-mini>
      </div>
      <div class="col-sm-2" *ngIf="ShowFlatStateWidget">
        <state-card-mini label="Apartments" [state]="FlatCount" link="#">
        </state-card-mini>
      </div>
      <div class="col-sm-2" *ngIf="ShowParkingNameWidget">
        <state-card-mini label="Parking Slot" [name]="ParkingSlotStatus" link="#">
        </state-card-mini>
      </div>

      <div class="col-xl-4 col-lg-4 col-sm" *ngIf="ShowFloorExpandedStateWidget"
      >
        <state-card-expandable
          label="Floors"
          [value]="FloorCount"
          [tabData]="FloorWidgetData"
        >
        </state-card-expandable>
      </div>
      <div class="col-xl-4 col-lg-4 col-sm" *ngIf="ShowParkingSlotStateWidget">
        <state-card-expandable
          label="Parking Slots"
          [value]="ParkingSlotCount"
          [tabData]="ParkingSlotWidgetData"
        >
        </state-card-expandable>
      </div>
    </div>

    <div class="row col-md-12">
      <div class="col-sm-2" *ngIf="ShowMaintenanceOfficersStateWidget">
        <state-card-mini label="Maintenance Officers" [state]="maintainerUserCount" link="#">
        </state-card-mini>
      </div>
      <div class="col-sm-2" *ngIf="ShowTenantStateWidget">
        <state-card-mini label="Tenant Users" [state]="tenantUserCount" link="#">
        </state-card-mini>
      </div>
      <div
        class="col-xl-8 col-lg-8 col-sm"
        style="height: 141px;"
        *ngIf="ShowServiceRequestStateWidget"
      >
        <state-card-expandable
          label="Service Request"
          [value]="ServiceRequestCount"
          [tabData]="ServiceRequestWidgetData"
        >
        </state-card-expandable>
      </div>
    </div>
  `,
  styleUrls: ["./widget-panel.component.css"],
})
export class WidgetPanelComponent
  extends RoleAuthorizerUtility
  implements OnInit
{
  // DATA
  public SecUserData: SecUserModel;
  public SecUserId: number;
  public SecUserRole: number;

  public BuildingObject: BuildingModel;
  public FlatObject: FlatModel;
  public ParkingObject: ParkingSlotModel;
  public FloorObject: FloorModel;

  public ServiceRequestList: ServiceRequestModel[];
  public BuildingList: BuildingModel[];
  public FloorList: FloorModel[];
  public FlatList: FlatModel[];
  public StatusList: StatusModel[];
  public ParkingSlotList: ParkingSlotModel[];
  public maintainerUserList: any;
  public tenantUserList: any;

  public ServiceRequestCount: number;
  public BuildingCount: number;
  public FloorCount: number;
  public FlatCount: number;
  public ParkingSlotCount: number;
  public maintainerUserCount: number;
  public tenantUserCount: number;

  public ParkingSlotStatus: string;

  public ServiceRequestWidgetData: StateCardTabModel[] = [];
  public FloorWidgetData: StateCardTabModel[] = [];
  public ParkingSlotWidgetData: StateCardTabModel[] = [];

  // SHOW WIDGETS BASED ON AUTHORIZATION
  public ShowServiceRequestStateWidget: boolean = false;
  public ShowFloorExpandedStateWidget: boolean = false;
  public ShowParkingSlotStateWidget: boolean = false;
  public ShowBuildingStateWidget: boolean = false;
  public ShowFloorStateWidget: boolean = false;
  public ShowFlatStateWidget: boolean = false;
  public ShowMaintenanceOfficersStateWidget: boolean = false;
  public ShowTenantStateWidget: boolean = false;

  public ShowBuildingNameWidget: boolean = false;
  public ShowFlatNameWidget: boolean = false;
  public ShowParkingNameWidget: boolean = false;
  public ShowFloorNameWidget: boolean = false;

  constructor(
    private _tenantService: TenantServicesService,
    private _tenantBuilding: TenantBuildingService,
    private _tenantUserManagement: TenantUserManagementService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.manageWidgetsBasedOnAuthorization();
    this.loadUserDataFromLocalStorage();

    await this.LoadUserData();
    await this.loadBuildings();
    await this.loadFloors();
    await this.loadFlats();
    await this.loadParkingSlot();
    await this.loadServiceRequests();
    await this.loadUsers();

    await this.loadStatus();

    this.ServiceRequestCount = this.ServiceRequestList?.length;
    this.BuildingCount = this.BuildingList?.length;
    this.FloorCount = this.FloorList?.length;
    this.FlatCount = this.FlatList?.length;
    this.ParkingSlotCount = this.ParkingSlotList?.length;
    this.maintainerUserCount = this.maintainerUserList?.length;
    this.tenantUserCount = this.tenantUserList?.length;

    this.prepareServiceRequestWidgetData();
    this.prepareFloorWidgetData();
    this.prepareParkingSlotWidgetData();
  }

  manageWidgetsBasedOnAuthorization(): void {
    if (this.isAuthorize([Roles.ADMIN])) {
      this.ShowServiceRequestStateWidget = true;
      this.ShowFloorExpandedStateWidget = true;
      this.ShowParkingSlotStateWidget = true;
      this.ShowBuildingStateWidget = true;
      this.ShowFlatStateWidget = true;
      this.ShowMaintenanceOfficersStateWidget = true;
      this.ShowTenantStateWidget = true
    }
    if (this.isAuthorize([Roles.TENANT])) {
      this.ShowBuildingNameWidget = true;
      this.ShowFlatNameWidget = true;
      this.ShowServiceRequestStateWidget = true;
      this.ShowFloorNameWidget = true;
      this.ShowParkingNameWidget = true;
    }
    if (this.isAuthorize([Roles.MAINTAINER_OFFICER])) {
      this.ShowBuildingNameWidget = true;
      this.ShowFlatStateWidget = true;
      this.ShowServiceRequestStateWidget = true;
      this.ShowFloorExpandedStateWidget = true;
      this.ShowParkingSlotStateWidget = true;
      this.ShowTenantStateWidget = true
    }
    if (this.isAuthorize([Roles.CLIENT])) {
      this.ShowBuildingNameWidget = true;
      this.ShowFlatStateWidget = true;
      this.ShowServiceRequestStateWidget = true;
      this.ShowFloorExpandedStateWidget = true;
      this.ShowParkingSlotStateWidget = true;
      this.ShowTenantStateWidget = true
    }
  }

  loadUserDataFromLocalStorage(): void {
    this.SecUserId = +localStorage.getItem("userId");
    this.SecUserRole = +localStorage.getItem("roleId");
  }

  async LoadUserData(): Promise<void> {
    if (this.SecUserId == null) return; //! Exit If UserId is null

    // TODO: Load SecUser Data From DB
    this.SecUserData = await this._tenantService.GetUserByIdUsingPromise(
      this.SecUserId
    );
  }

  async loadBuildings(): Promise<void> {
    // TODO: Load Building
    if (this.isAuthorize([Roles.ADMIN]))
      this.BuildingList = await this._tenantBuilding.GetAllBuildings();
    if (this.isAuthorize([Roles.CLIENT]))
      this.BuildingList = await this._tenantBuilding.GetAllBuildings();

    if (!this.SecUserData) return; //! Exit If this.SecUserData is null

    const { buildingId } = this.SecUserData;

    if (!buildingId) return; //! Exit If buildingId is null

    if (this.isNotAuthorize([Roles.ADMIN]))
      this.BuildingObject = await this._tenantBuilding.GetBuildingById(
        buildingId
      );
    if (this.isNotAuthorize([Roles.CLIENT]))
      this.BuildingObject = await this._tenantBuilding.GetBuildingById(
        buildingId
      );
  }

  async loadFloors(): Promise<void> {
    // TODO: Load Floors
    if (this.isAuthorize([Roles.ADMIN]))
      this.FloorList = await this._tenantBuilding.GetAllFloor();
    if (this.isAuthorize([Roles.CLIENT]))
      this.FloorList = await this._tenantBuilding.GetAllFloor();
    if (this.isAuthorize([Roles.MAINTAINER_OFFICER]))
      this.FloorList = await this._tenantBuilding.GetAllFloor([
        {
          QueryParam: "BuildingId",
          value: this.SecUserData.buildingId,
          method: ParamMethod.FILTER,
          filterOperator: FilterOperator.EQUAL,
        }
      ]);
    if (this.isAuthorize([Roles.TENANT]))
      this.FloorObject = await this._tenantBuilding.GetFloorById(this.SecUserData.floorId)
  }

  async loadParkingSlot(): Promise<void> {
    // TODO: Load Parking Slots
    if (this.isAuthorize([Roles.ADMIN]))
      this.ParkingSlotList = await this._tenantBuilding.GetAllParkingSlot();
    if (this.isAuthorize([Roles.MAINTAINER_OFFICER]))
      this.ParkingSlotList = await this._tenantBuilding.GetAllParkingSlot([
        {
          QueryParam: "BuildingId",
          value: this.SecUserData.buildingId,
          method: ParamMethod.FILTER,
          filterOperator: FilterOperator.EQUAL,
        }
      ]);
      if (this.isAuthorize([Roles.TENANT])){
        if(this.FlatObject?.parkingSlotId){
          this.ParkingObject = await this._tenantBuilding.GetParkingSlotById(this.FlatObject.parkingSlotId);
          this.ParkingSlotStatus = this.ParkingObject.name;
        }else{
          this.ParkingSlotStatus = "Not Allocated"
        }
      }
  }

  async loadFlats(): Promise<void> {
    if (!this.SecUserData) return; //! Exit If this.SecUserData is null

    const { buildingId, flatId, floorId } = this.SecUserData;

    // TODO: Load All Flats
    if (this.isAuthorize([Roles.ADMIN]))
      this.FlatList = await this._tenantBuilding.GetAllFlat();

    if (!buildingId) return; //! Exit If buildingId is null

    // TODO: Load Flats Base on Building Id
    if (this.isNotAuthorize([Roles.ADMIN])) {
      debugger;
      this.FlatList = await this._tenantBuilding.GetAllFlat([
        {
          QueryParam: "BuildingId",
          value: buildingId,
          method: ParamMethod.FILTER,
          filterOperator: FilterOperator.EQUAL,
        },
      ]);
      debugger;
      if (!flatId) return; //! Exit If flatId is null

      this.FlatObject = await this._tenantBuilding.GetFlatById(flatId);
      
      
    }
  }

  async loadStatus(): Promise<void> {
    // TODO: Load Status
    this.StatusList = await this._tenantService.GetAllStatus();
  }

  async loadServiceRequests(): Promise<void> {
    const { buildingId } = this.SecUserData;
    // if (!buildingId) return; //! Exit If buildingId is null

    // TODO: Load Service Request Base on Building Id
    const queryParamList: QueryParamModel[] = [];

    switch (this.SecUserRole) {
      case Roles.TENANT:
        queryParamList.push({
          QueryParam: "CreatedById",
          value: this.SecUserId,
          method: ParamMethod.FILTER,
          filterOperator: FilterOperator.EQUAL,
        });
        break;
      case Roles.MAINTAINER_OFFICER:
        queryParamList.push({
          QueryParam: "BuildingId",
          value: buildingId,
          method: ParamMethod.FILTER,
          filterOperator: FilterOperator.EQUAL,
        });
        break;
    }

    this.ServiceRequestList = await this._tenantService.GetAllServiceRequest(
      queryParamList
    );
  }

  async loadUsers(): Promise<void> {
    //* Load Building
    const queryParamForMaintainer = [{
      QueryParam: "roleId",
      value: Roles.MAINTAINER_OFFICER,
      method: ParamMethod.FILTER,
      filterOperator: FilterOperator.EQUAL,
    }]
    const queryParamForTenant = [{
      QueryParam: "roleId",
      value: Roles.TENANT,
      method: ParamMethod.FILTER,
      filterOperator: FilterOperator.EQUAL,
    }]

    if (this.isAuthorize([Roles.MAINTAINER_OFFICER])) {
      queryParamForTenant.push(
        {
          QueryParam: "BuildingId",
          value: this.SecUserData.buildingId,
          method: ParamMethod.FILTER,
          filterOperator: FilterOperator.EQUAL,
        } 
      )
    }

    if (this.isAuthorize([Roles.ADMIN])) this.maintainerUserList = await this._tenantUserManagement.GetAllUsers(queryParamForMaintainer);
      
    if (this.isAuthorize([Roles.ADMIN, Roles.MAINTAINER_OFFICER])) this.tenantUserList = await this._tenantUserManagement.GetAllUsers(
        queryParamForTenant
      );
  }

  prepareServiceRequestWidgetData(): void {
    if (this.StatusList == null) return; //! Exit If this.StatusList is null

    this.StatusList.forEach((status) => {
      const obj: StateCardTabModel = {
        labelId: status.id,
        label: status.name,
        number: 0,
      };

      this.ServiceRequestWidgetData.push(obj);
    });

    this.ServiceRequestList.forEach((SR) => {
      switch (+SR.statusId) {
        case 1:
          this.ServiceRequestWidgetData.find((el) => el.labelId === 1).number++;
          break;
        case 2:
          this.ServiceRequestWidgetData.find((el) => el.labelId === 2).number++;
          break;
        case 3:
          this.ServiceRequestWidgetData.find((el) => el.labelId === 3).number++;
          break;
        case 4:
          this.ServiceRequestWidgetData.find((el) => el.labelId === 4).number++;
          break;
      }
    });
  }

  prepareFloorWidgetData() {
    if (this.FloorList == null) return; //! Exit If this.FloorList is null

    if (this.isAuthorize([Roles.ADMIN, Roles.MAINTAINER_OFFICER])) {
      const residenceFloorCount = this.FloorList.filter(
        (floor) => floor.floorTypeId == FloorType.RESIDENCE
      )?.length;

      const parkingFloorCount = this.FloorList.filter(
        (floor) => floor.floorTypeId == FloorType.PARKING
      )?.length;

      this.FloorWidgetData = [
        {
          label: "Residence Floors",
          number: residenceFloorCount,
        },
        {
          label: "Parking Floors",
          number: parkingFloorCount,
        },
      ];
    }
  }

  prepareParkingSlotWidgetData() {
    if (this.ParkingSlotList == null) return; //! Exit If this.ParkingSlotList is null

    if (this.isAuthorize([Roles.ADMIN, Roles.MAINTAINER_OFFICER])) {
      const allocatedParkingSlotCount = this.ParkingSlotList.filter(
        (slot) => slot.isAllotted == true
      )?.length;

      const freeParkingSlotCount = this.ParkingSlotList.filter(
        (slot) => slot.isAllotted == false || slot.isAllotted == null
      )?.length;

      this.ParkingSlotWidgetData = [
        {
          label: "Allocated Slots",
          number: allocatedParkingSlotCount,
        },
        {
          label: "Free Slots",
          number: freeParkingSlotCount,
        },
      ];
    }
  }
}
