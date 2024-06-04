import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { NATURAL_HAZARDS_EARTHQUAKE_ENABLED, NATURAL_HAZARDS_FLOOD_ENABLED, NATURAL_HAZARDS_WIND_ENABLED } from '@btp/shared-ui';
import { NatHazOverview } from './NatHazOverview';
import { useLocation } from 'react-router-dom';
import { mockFlags } from 'jest-launchdarkly-mock';
import { useAccount } from 'src/common/contexts/AccountContext';
import { useHeader } from 'src/common/contexts/HeaderContext';
import { useFetchEarthMovementBarAndAccordionData } from 'src/hooks/useFetchEarthMovementBarData';
import { useFetchFloodTIVData } from 'src/hooks/useFetchFloodTIVData';
import { RightUtilityBar } from 'src/common/components/RightUtilityBar';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
  }),
  useSearchParams: () => [new URLSearchParams({ currency: '02' })],
}));

jest.mock('src/hooks/useFetchEarthMovementBarData', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    EarthMovementBarData: [],
    EarthMovementAccordionData: [],
  })),
}));

jest.mock('src/hooks/useFetchFloodTIVData', () => ({
  __esModule: true,
  useFetchFloodTIVData: jest.fn(() => ({
    floodTIVDetails: {
      highActive: 0,
      highProspect: 0,
      reducedActive: 0,
      reducedProspect: 0,
      moderateActive: 0,
      moderatePropect: 0,
      lowActive: 0,
      lowProspect: 0,
    },
  })),
}));

jest.mock('src/common/contexts/AccountContext', () => ({
  __esModule: true,
  useAccount: jest.fn(() => ({
    accountDetails: { orgid: '12345' },
  })),
}));

jest.mock('src/common/contexts/HeaderContext', () => ({
  __esModule: true,
  useHeader: jest.fn(() => ({
    activeTab: 0,
    setActiveTab: jest.fn(),
    tivResult: [],
    includeProspect: true,
    setIncludeProspect: jest.fn(),
  })),
}));

jest.mock('src/common/components/RightUtilityBar', () => ({
  __esModule: true,
  RightUtilityBar: () => null,
}));

describe('NatHazOverview Component', () => {
  beforeEach(() => {
    mockFlags({
      [NATURAL_HAZARDS_FLOOD_ENABLED]: true,
      [NATURAL_HAZARDS_WIND_ENABLED]: true,
      [NATURAL_HAZARDS_EARTHQUAKE_ENABLED]: true,
    });
  });

  it('renders NatHazOverview page successfully', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <NatHazOverview />
      </MockedProvider>
    );
    expect(screen.getByTestId('overview')).toBeDefined();
  });

  it('Flood module is available', () => {
    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <NatHazOverview />
      </MockedProvider>
    );
    const floodLink = getByText('Flood');
    expect(floodLink).toBeInTheDocument();
  });

  it('Navigates to Flood page when Flood link is clicked', async () => {
    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate = () => mockNavigate;

    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <NatHazOverview />
      </MockedProvider>
    );
    const floodLink = getByText('Flood').closest('rds-link');
    if (floodLink) {
      await waitFor(() => userEvent.click(floodLink));
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('flood'));
    }
  });

  it('Wind module is available', () => {
    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <NatHazOverview />
      </MockedProvider>
    );
    const windLink = getByText('Wind');
    expect(windLink).toBeInTheDocument();
  });

  it('Navigates to Wind page when Wind link is clicked', async () => {
    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate = () => mockNavigate;

    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <NatHazOverview />
      </MockedProvider>
    );
    const windLink = getByText('Wind').closest('rds-link');
    if (windLink) {
      await waitFor(() => userEvent.click(windLink));
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('wind'));
    }
  });

  it('Earth-Movement module is available', () => {
    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <NatHazOverview />
      </MockedProvider>
    );
    const earthMovementLink = getByText('Earth Movement');
    expect(earthMovementLink).toBeInTheDocument();
  });

  it('Navigates to Earth Movement page when Earth Movement link is clicked', async () => {
    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate = () => mockNavigate;

    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <NatHazOverview />
      </MockedProvider>
    );
    const earthMovementLink = getByText('Earth Movement').closest('rds-link');
    if (earthMovementLink) {
      await waitFor(() => userEvent.click(earthMovementLink));
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('earth-movement'));
    }
  });

  it('does not set activeTab if pathname is overview and activeTab is 0', () => {
    const mockSetActiveTab = jest.fn();
    require('src/common/contexts/HeaderContext').useHeader.mockReturnValue({
      activeTab: 0,
      setActiveTab: mockSetActiveTab,
    });

    const { getByTestId } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <NatHazOverview />
      </MockedProvider>
    );
    expect(mockSetActiveTab).not.toHaveBeenCalledWith(0);
  });
});


------------------------------------------------------------------------------

import {
  NATURAL_HAZARDS_EARTHQUAKE_ENABLED,
  NATURAL_HAZARDS_FLOOD_ENABLED,
  NATURAL_HAZARDS_WIND_ENABLED,
  AccType,
} from '@btp/shared-ui';
import { RiskAccordion } from 'shared-ui/src/lib/RiskAccordion';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { RdsBox, RdsText } from 'rds-components-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NatHazFilters from 'src/NatHazDetails/NatHazFilters/NatHazFilters';
import { useAccount } from 'src/common/contexts/AccountContext';
import { useHeader } from 'src/common/contexts/HeaderContext';
import { NatHazModuleUrlRouteEnum } from 'src/common/utils/constants/nathaz.enum';
import { getNavigationUrl } from 'src/common/utils/navigationHelper';
import useFetchEarthMovementBarAndAccordionData from 'src/hooks/useFetchEarthMovementBarData';
import CreateEarthMovementBarChart from 'src/common/components/charts/EarthMovementBarChart';
import { RightUtilityBar } from 'src/common/components/RightUtilityBar';
import { useFetchFloodTIVData } from 'src/hooks/useFetchFloodTIVData';
import { createDataForCharts } from 'src/NatHazContainer/charts/utils';

export function NatHazOverview() {
  const { accountDetails } = useAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { EarthMovementBarData, EarthMovementAccordionData } =
    useFetchEarthMovementBarAndAccordionData();
  const {
    activeTab,
    setActiveTab,
    tivResult,
    includeProspect,
    setIncludeProspect,
  } = useHeader();
  const flags = useFlags();
  const floodEnabled = flags[NATURAL_HAZARDS_FLOOD_ENABLED];
  const windEnabled = flags[NATURAL_HAZARDS_WIND_ENABLED];
  const earthquakeEnabled = flags[NATURAL_HAZARDS_EARTHQUAKE_ENABLED];
  const { floodTIVDetails } = useFetchFloodTIVData();
  const [perilData, setPerilData] = useState<AccType[]>([]);
  const handleTitleClick = (title: string) => {
    let pageUrl: string = '';
    switch (title) {
      case 'Flood':
        pageUrl = floodEnabled ? NatHazModuleUrlRouteEnum.FLOODURL : '';
        break;
      case 'Wind':
        pageUrl = windEnabled ? NatHazModuleUrlRouteEnum.WINDURL : '';
        break;
      case 'Earth Movement':
        pageUrl = earthquakeEnabled ? NatHazModuleUrlRouteEnum.EARTHURL : '';
        break;
      default:
        break;
    }
    if (pageUrl) {
      navigate(
        getNavigationUrl({
          locationPath: pathname,
          orgId: accountDetails.orgid,
          pageUrl,
        }),
      );
    }
  };

  const updatedPerilData: AccType[] = perilData
    ?.map((item) => {
      if (
        (item.accTitle === 'Flood' && floodEnabled) ||
        (item.accTitle === 'Wind' && windEnabled) ||
        (item.accTitle === 'Earth Movement' && earthquakeEnabled)
      ) {
        return {
          ...item,
          onTitleClick: (title: string) => handleTitleClick(title),
        };
      }
      return {
        accTitle: '',
      };
    })
    .filter((item) => item.accTitle !== '');

  useEffect(() => {
    if (
      (pathname.endsWith(`${accountDetails.orgid}`) ||
        pathname.endsWith(`${accountDetails.orgid}/`)) &&
      activeTab !== 0
    ) {
      setActiveTab(0);
    }
  }, [accountDetails.orgid, activeTab, pathname, setActiveTab]);

  useEffect(() => {
    const earthMovementChartData = CreateEarthMovementBarChart(
      EarthMovementBarData,
      EarthMovementAccordionData,
    );
    const earthMovementChart = includeProspect
      ? earthMovementChartData[0]
      : earthMovementChartData[1];
    const chart = createDataForCharts(floodTIVDetails, includeProspect);
    setPerilData([chart[0], earthMovementChart]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeProspect]);

  return (
    <RdsBox
      className="w-full h-full overflow-auto"
      data-testid="overview"
      height="calc(100vh - 4rem)"
    >
      <div className="flex flex-row">
        <div className="flex flex-row flex-grow">
          <div className="flex-grow pb-4">
            <NatHazFilters
              tivResult={tivResult}
              includeProspect={includeProspect}
              setIncludeProspect={setIncludeProspect}
            />
            <RdsBox margin="2xl">
              <RdsText weight="semibold">NatHaz Risk Scores</RdsText>
              <RiskAccordion accData={updatedPerilData} />
            </RdsBox>
          </div>
        </div>
        <RdsBox
          className="flex-shrink-0 h-full overflow-auto"
          height="calc(100vh - 4rem)"
        >
          <RightUtilityBar />
        </RdsBox>
      </div>
    </RdsBox>
  );
}

export default NatHazOverview;
