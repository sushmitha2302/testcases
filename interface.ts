import {
  NavType,
  RowDataType,
  SituationalAnalysisSection,
} from '@btp/shared-ui';
import { RowClickedEvent } from 'ag-grid-community';

export interface Props {
  children: React.ReactNode;
}

export interface Translations {
  [key: string]: string;
}

export interface User {
  userId: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  userCategory: string | undefined;
}

export interface Account {
  prospect_client_id?: number | null;
  prospect_client_name?: string | null;
  prospect_client_number?: string | null;
  user_id?: string | null;
  __typename?: unknown;
}

export interface BusinessInterestFloodDetailsResponse {
  current_business_interests: BusinessInterestFloodDetails[];
}

export interface BusinessInterestWindDetailsResponse {
  current_business_interests: BusinessInterestWindDetails[];
}

export interface BusinessInterestFloodDetails {
  cbi_id: number;
  cbi_version_id: number;
  prospect_client_id: number;
  changes_in_effect_date: string;
  id: number;
  serviced_location: ServicedLocation | null;
  type_description: string;
  status_description: string;
  name: string;
  street: string;
  city_name: string;
  county_name: string;
  state_province_name: string;
  postal_code: string;
  country_name: string;
  occupancy: Occupancy;
  occupancy_source_type_description: string;
  latitude_longitude_match_code: string;
  latitude_longitude_match_description: string;
  latitude_measure: number;
  longitude_measure: number;
  reported_currency_client_reported_property_amount: number | null;
  reported_currency_client_reported_te_amount: number | null;
  reported_currency_te_amount: number | null;
  flood_cell: string;
  flood_index_description: string;
  flood_index_simplified_zone_description: string;
  flood_hazard_zone_description: string;
  levee_code: string;
  levee_adequacy_code: string;
  underwriting_wind_tier_code: string;
  reported_currency_type: ReportedCurrency;
}

export interface BusinessInterestWindDetails {
  cbi_id: number;
  changes_in_effect_date: string;
  local_reference: string;
  serviced_location: ServicedLocation | null;
  type_description: string;
  status_description: string;
  name: string;
  street: string;
  city_name: string;
  postal_code: string;
  county_name: string;
  state_province_name: string;
  state_province_code: string;
  country_name: string;
  country_code: string;
  occupancy: Occupancy;
  occupancy_source_type_description: string;
  latitude_longitude_match_code: string;
  latitude_longitude_match_description: string;
  latitude_measure: number;
  longitude_measure: number;
  reported_currency_client_reported_property_amount: number | null;
  reported_currency_client_reported_te_amount: number | null;
  reported_currency_te_amount: number | null;
  underwriting_wind_tier_code: string;
  reported_currency_type: ReportedCurrency;
  windspeed_miles_per_hour_measure: number | null;
}

export interface BusinessInterestEarthMovementDetailsResponse {
  current_business_interests: BusinessInterestEarthMovementDetails[];
}

export interface BusinessInterestEarthMovementDetails {
  changes_in_effect_date: string;
  cbi_id: number;
  cbi_version_id: number;
  prospect_client_id: number;
  serviced_location: ServicedLocation | null;
  type_description: string;
  status_description: string;
  name: string;
  street: string;
  city_name: string;
  postal_code: string;
  county_name: string;
  state_province_name: string;
  country_name: string;
  occupancy: Occupancy;
  latitude_longitude_match_code: string;
  latitude_longitude_match_description: string;
  latitude_measure: number;
  longitude_measure: number;
  reported_currency_client_reported_property_amount: number | null;
  reported_currency_client_reported_te_amount: number | null;
  reported_currency_te_amount: number | null;
  earthquake_frequency_zone_description: string;
  earthquake_region_description: string;
  reported_currency_type: ReportedCurrency;
}

export interface ServicedLocation {
  index_record_number: string;
  btp_site_engineering: {
    site_detail: {
      flood_hazard_zone_code: string;
    };
    wind_loss_expectancy: SiteLossScenario[];
    wind_normal_loss_expectancy: SiteLossScenario[];
    active_wind_recommendations: SiteRecommendation[];
    site_visit: {
      order_final_conference_date: string;
    };
    site_operating_schedule_and_protection: {
      ferp_indicator: string;
    };
    flood_100_year_loss_expectancy: FloodSiteLossScenario[];
    flood_500_year_loss_expectancy: FloodSiteLossScenario[];
    flood_100_year_lafp_fail_loss_expectancy: FloodSiteLossScenario[];
    flood_500_year_lafp_fail_loss_expectancy: FloodSiteLossScenario[];
    site_structure_construction: SiteStructureConstruction | null;
    active_ferp_recommendations: SiteRecommendation[];
    active_flood_recommendations: SiteRecommendation[];
  };
}

export interface SiteRecommendation {
  code: string;
  status_code: string;
}

export interface FloodSiteLossScenario {
  source_hazard_characteristic_id: number;
  pd_amount: CurrencyAmount[];
  te_amount: CurrencyAmount[];
}
export interface SiteLossScenario {
  type_code_description: string;
  pd_amount: CurrencyAmount[];
  te_amount: CurrencyAmount[];
}

export interface CurrencyAmount {
  amount_converted: {
    amount: number | null;
  };
}

export interface SiteStructureConstruction {
  structure_construction_details: StructureConstructionDetails[];
}

export interface StructureConstructionDetails {
  below_grade_space_indicator: string;
}

export interface Occupancy {
  full_occupancy_code: string;
}
export interface ReportedCurrency {
  from_exchange_rates: FromExchangeRates[];
}

export interface FromExchangeRates {
  from_currency_id: number;
  to_currency_id: number;
  currency_exchange_rate: number | null;
  exchange_rate_date: string;
}

export interface Accounts {
  latest_prospect_clients: Account[];
}

export interface AppInsightTelemetryData {
  message: string;
  severity?: number | undefined;
}

export interface AppInsightTelemetryExceptionData {
  exception: Error;
  measurements?: {
    [key: string]: number;
  };
  severity?: number;
}

export interface IAppInsightsTelemetryClient {
  trackTrace(telemetry: {
    message: string;
    severity?: number;
    properties?: { [key: string]: string };
  }): void;
  trackException(telemetry: {
    exception: Error;
    severity?: number;
    properties?: { [key: string]: string };
  }): void;
}

export interface IRouteParams {
  orgid?: string;
  currency?: string;
  asOfDate?: string;
}

export interface IRouteParamsContext {
  routeParams: IRouteParams;
  setRouteParams: React.Dispatch<React.SetStateAction<IRouteParams>>;
}
export interface TivDataType {
  activeLocationCount: number | null;
  activeLocationTivAmount: number | null;
  prospectLocationCount: number | null;
  prospectLocationTivAmount: number | null;
}

export interface IHeaderContext {
  activeSPA: string | null;
  setActiveSPA: (spa: string) => void;
  activeModule: string | null;
  setActiveModule: (module: string | null) => void;
  activeTab: number | undefined;
  setActiveTab: (tab: number | undefined) => void;
  selectedCurrency: number | null;
  setSelectedCurrency: (module: number) => void;
  asofDate: Date | null;
  setAsofDate: (module: Date) => void;
  currencyList: CurrencyType[];
  setCurrencyList: (currencyList: CurrencyType[]) => void;
  isAccountInContext: boolean | null;
  setIsAccountInContext: (module: boolean) => void;
  isSidebarDisplayed: boolean;
  setIsSidebarDisplayed: (setValue: boolean) => void;
  selectedLocations: RowDataType | null;
  setSelectedLocations: (value: RowDataType) => void;
  handleSelectionChange: (value: RowDataType) => void;
  tivResult: TivDataType | null;
  setTivResult: (value: TivDataType | null) => void;
  includeProspect: boolean;
  setIncludeProspect: (value: boolean) => void;
}

export interface IAccountContext {
  accountDetails: AccountDetails;
  setAccountDetails: (details: AccountDetails) => void;
}

export interface NatHazNavType {
  module: string;
  url: string;
  moduleNav: NavType[];
}

export interface AccountDetails {
  orgid: number;
  accountNumber: string;
  accountName: string;
  internalCurrency: number;
  currencyType: CurrencyType;
}

export interface CurrencyType {
  code?: string | null;
  description?: string | null;
  id?: number;
}

export interface RedirectNotification {
  canNotify: boolean;
  message?: string;
}

export interface FloodChartType {
  lowValue: number | null;
  highValue: number | null;
  reducedValue: number | null;
  moderateValue: number | null;
  highPrspectValue: number | null;
  moderatePrspectValue: number | null;
  reducedPrspectValue: number | null;
  lowPrspectValue: number | null;
}
export type NatHazGridProps = {
  onSelectionChange?: (row: RowDataType) => void;
  onRowClicked?: (event: RowClickedEvent) => void;
  rowSelection?: 'multiple' | 'single';
};

export type FloodActiveLocAgg = {
  total_insured_value: number;
  hundred_year_loss_expectancy: number;
  five_hundred_year_loss_expectancy: number;
  location_count: number;
};
export type FloodAggProps = {
  floodTivData: FloodActiveLocAgg[];
  flood_hazard_frequency: string;
  active_location_aggregates: FloodActiveLocAgg;
  prospect_location_aggregates: FloodActiveLocAgg;
};
export interface SituationalAnalysisConclusion {
  text: string | null;
  section: SituationalAnalysisSection;
  updateDate: Date | null;
}
