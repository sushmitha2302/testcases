import { render, screen, fireEvent } from '@testing-library/react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccount } from 'src/common/contexts/AccountContext';
import { useHeader } from 'src/common/contexts/HeaderContext';
import useFetchWindBarAndAccordionData from 'src/hooks/useFetchWindBarChartData';
import useFetchEarthMovementBarAndAccordionData from 'src/hooks/useFetchEarthMovementBarData';
import { useFetchFloodBarAndAccordionData } from 'src/hooks/useFetchFloodBarData';
import NatHazOverview  from './NatHazOverview';
import { getNavigationUrl } from 'src/common/utils/navigationHelper';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));
jest.mock('launchdarkly-react-client-sdk');
jest.mock('src/common/contexts/AccountContext');
jest.mock('src/common/contexts/HeaderContext');
jest.mock('src/hooks/useFetchWindBarChartData');
jest.mock('src/hooks/useFetchEarthMovementBarData');
jest.mock('src/hooks/useFetchFloodBarData');
jest.mock('src/common/utils/navigationHelper', () => ({
  getNavigationUrl: jest.fn(),
}));

describe('NatHazOverview', () => {
  const mockNavigate = jest.fn();
  const mockUseFlags = useFlags as jest.Mock;
  const mockUseNavigate = useNavigate as jest.Mock;
  const mockGetNavigationUrl = getNavigationUrl as jest.Mock;
  const mockUseLocation = useLocation as jest.Mock;
  const mockUseAccount = useAccount as jest.Mock;
  const mockUseHeader = useHeader as jest.Mock;
  const mockUseFetchWindBarAndAccordionData =
    useFetchWindBarAndAccordionData as jest.Mock;
  const mockUseFetchEarthMovementBarAndAccordionData =
    useFetchEarthMovementBarAndAccordionData as jest.Mock;
  const mockUseFetchFloodBarAndAccordionData =
    useFetchFloodBarAndAccordionData as jest.Mock;

  beforeEach(() => {
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseLocation.mockReturnValue({ pathname: '' });
    mockUseAccount.mockReturnValue({ accountDetails: { orgid: '9966' } });
    mockUseHeader.mockReturnValue({
      activeTab: 0,
      setActiveTab: jest.fn(),
      includeProspect: true,
      setIncludeProspect: jest.fn(),
      asofDate: '2021-01-01',
    });
    mockUseFetchWindBarAndAccordionData.mockReturnValue({
      WindAttributes: {
        as_of_date: '',
        currency_type_id: null,
        org_prospect_client_id: null,
        totalLocationCount: 4,
        totalTIV: 200,
        totalActiveLocationCount: 4,
        totalActiveTIV: 200,
        windLossExpectancy: 100,
        windLossActiveExpectancy: 110,
        wind_region_aggregates: [
          {
            windRegion: 'North',
            location_aggregates: {
              totalInsuredValue: 3,
              windLossExpectancy: 4,
              locationCount: 5,
            },
            active_location_aggregates: {
              totalInsuredValue: 1,
              windLossExpectancy: 3,
              locationCount: 5,
            },
            wind_tier_aggregates: [
              {
                underWritingWindTierCode: 'North',
                underWritingWindTierDescription: 'severe',
                totalLocationCount: 200,
                totalTIV: 800,
                windLossExpectancy: 100,
      
                activeLocationCount: 100,
                activeTIV: 100,
                windLossActiveExpectancy: 200,
      
                prospectTIV: 400,
                windLossProspectExpectancy: 200,
                prospectLocationCount: 300,
              },
            ],
          },
        ],
        riskQuality: 'Minimal',
        activeLocationsRiskQuality: 'Minimal',
      },
      loading: false,
      errorCode: null,
      refetch: jest.fn(),
    });
    mockUseFetchEarthMovementBarAndAccordionData.mockReturnValue({
      EarthMovementAttributes: {
        totalLocationCount: 4,
        totalTIV: 200,
        totalActiveLocationCount: 4,
        totalActiveTIV: 200,
        earthquake_frequency_zone_aggregates: [
          {
            zoneCode: '50',
            zoneDescription: '50',
            totalLocationCount: 4,
            totalTIV: 200,
            activeLocationCount: 4,
            activeTIV: 200,
            prospectLocationCount: 10,
            prospectTIV: 10,
          },
        ],
        earthquake_region_aggregates: [
          {
            regionCode: 'REGION1',
            regionDescription: 'Region 1',
            totalLocationCount: 4,
            totalTIV: 200,
            activeLocationCount: 4,
            activeTIV: 200,
          },
        ],
        as_of_date: '',
        currency_type_id: null,
        org_prospect_client_id: null,
        riskQuality: 'Minimal',
        activeLocationsRiskQuality: 'Minimal'  
      },
      loading: false,
      errorCode: null,
      refetch: jest.fn(),
    });
    mockUseFetchFloodBarAndAccordionData.mockReturnValue({
      FloodAttributes: {
        org_prospect_client_id: 9966,
        as_of_date: '2024-05-24',
        currency_type_id: 47,
        floodAggData: [
          {
            flood_hazard_frequency: 'High',
            location_aggregates: {
              total_insured_value: 10,
              hundred_year_loss_expectancy: 10,
              five_hundred_year_loss_expectancy: 10,
              location_count: 10,
            },
            active_location_aggregates: {
              total_insured_value: 10,
              hundred_year_loss_expectancy: 10,
              five_hundred_year_loss_expectancy: 10,
              location_count: 10,
            },
            prospect_location_aggregates: {
              total_insured_value: 10,
              hundred_year_loss_expectancy: 10,
              five_hundred_year_loss_expectancy: 10,
              location_count: 10,
            },
          },
        ],
        totalLocationCount: 4,
        totalTIV: 200,
        totalActiveLocationCount: 4,
        totalActiveTIV: 250,
        riskQuality: 'Very Severe',
        activeLocationsRiskQuality: 'Severe',
      },
      loading: false,
      errorCode: null,
      refetch: jest.fn(),
    });
    mockUseFlags.mockReturnValue({
      NATURAL_HAZARDS_EARTHQUAKE_ENABLED: true,
      NATURAL_HAZARDS_FLOOD_ENABLED: true,
      NATURAL_HAZARDS_WIND_ENABLED: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the NatHazOverview component', () => {
    const {getByText} = render(<NatHazOverview />);
    expect(screen.getByTestId('overview')).toBeInTheDocument();
    expect(getByText('Flood')).toBeInTheDocument();
  });

  it('should call the refetch functions on mount', () => {
    const earthMovementRefetch = jest.fn();
    const windRefetch = jest.fn();
    const floodRefetch = jest.fn();

    mockUseFetchEarthMovementBarAndAccordionData.mockReturnValueOnce({
      EarthMovementAttributes: {},
      loading: false,
      errorCode: null,
      refetch: earthMovementRefetch,
    });
    mockUseFetchWindBarAndAccordionData.mockReturnValueOnce({
      WindAttributes: {},
      loading: false,
      errorCode: null,
      refetch: windRefetch,
    });
    mockUseFetchFloodBarAndAccordionData.mockReturnValueOnce({
      FloodAttributes: {},
      loading: false,
      errorCode: null,
      refetch: floodRefetch,
    });

    render(<NatHazOverview />);

    expect(earthMovementRefetch).toBeDefined();
    expect(windRefetch).toBeDefined();
    expect(floodRefetch).toBeDefined();
  });

  it('should render flood chart and accordion in overview page and trigger handleTitleClick', () => {
    const handleTitleClick = jest.fn();
    const mockAccordion = () => (
      <div
        data-testid="Flood"
        onClick={() => {
          handleTitleClick("Flood");
        }}
      />
    );
    render(<NatHazOverview />, { wrapper: mockAccordion });
    fireEvent.click(screen.getByTestId('Flood'));
    expect(handleTitleClick).toHaveBeenCalledTimes(1);
  });

  it('should render wind chart and accordion in overview page and trigger handleTitleClick', () => {
    const handleTitleClick = jest.fn();
    const mockAccordion = () => (
      <div
        data-testid="Wind"
        onClick={() => {
          handleTitleClick("Wind");
        }}
      />
    );
    render(<NatHazOverview />, { wrapper: mockAccordion });
    fireEvent.click(screen.getByTestId('Wind'));
    expect(handleTitleClick).toHaveBeenCalledTimes(1);
  });

  it('should render earth movement chart and accordion in overview page and trigger handleTitleClick', () => {
    const handleTitleClick = jest.fn();
    const mockAccordion = () => (
      <div
        data-testid="Earth Movement"
        onClick={() => {
          handleTitleClick("Earth Movement");
        }}
      />
    );
    render(<NatHazOverview />, { wrapper: mockAccordion });
    fireEvent.click(screen.getByTestId('Earth Movement'));
    expect(handleTitleClick).toHaveBeenCalledTimes(1);
  });

  it('do not set activetab if pathname is overview and activetab is 0', () => {
    useLocation().pathname = '/7765/';
    const setActiveTab = jest.fn();
    require('src/common/contexts/HeaderContext').useHeader.mockReturnValue({
      activeTab: 0,
      setActiveTab,
    });
    render(<NatHazOverview />);
    expect(setActiveTab).not.toHaveBeenCalledWith(0);
  });
});
