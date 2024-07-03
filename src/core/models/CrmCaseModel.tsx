export interface CRMCaseModel {
  activityid: string;
  attachmentIdList: string[];
  createdon: Date;
  description: string;
  gorevDurumu: number;
  incident: Incident;
  objectTypeCode: number;
  portalUserId: string;
  subject: string;
  taskResolutionDescription: null;
  teamtoBeassignedId: string;
  trueTeamId: string;
  statusCode: number;
  timeToClosingDate: string;
  reasonForHolding: number;
  onHoldBefore: boolean;
}

export interface Incident {
  taskAssignedteamName: string;
  brand: Brand;
  business: Business;
  caseOriginCode: number;
  createdOn: Date;
  description: null;
  incidentContact: IncidentContact;
  incidentCrmId: string;
  layer1: Brand;
  layer2: Brand;
  layer3: Brand;
  orderNumber: string;
  productID: null;
  productName: null;
  shipmentNumber: string;
  ticketNumber: string;
  title: string;
  uibNo: string;
  uzm_storetypepicklist: number;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Business {
  businessUnitId: string;
  name: string;
}

export interface IncidentContact {
  contactId: string;
  entityName: string;
  name: string;
  fisrtName: string;
  lastName: string;
  mobilePhone: string;
}
