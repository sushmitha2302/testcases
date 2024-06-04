import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NatHazOverview } from './NatHazOverview';
import { mockFlags } from 'jest-launchdarkly-mock';
import { useLocation } from 'react-router-dom';
import { useAccount } from 'src/common/contexts/AccountContext';
import { useHeader } from 'src/common/contexts/HeaderContext';
import useFetchEarthMovementBarAndAccordionData from 'src/hooks/useFetchEarthMovementBarData';
import { MockedProvider } from '@apollo/client/testing';
import { NATURAL_HAZARDS_EARTHQUAKE_ENABLED } from '@btp/shared-ui';

const mockUsedNavigate = jest.fn();
const mockUsedLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
  useLocation: () => mockUsedLocation,
  useSearchParams: () => [new URLSearchParams({ currency: '02' })],
}));

jest.mock('src/hooks/useGetAccountDetails', () => ({
  __esModule: true,
  useGetAccountDetails: jest.fn(() => {
    return {
      setOrgId: jest.fn(),
    };
  }),
}));

jest.mock('src/hooks/useFetchFloodTIVData', () => ({
  __esModule: true,
  useFetchFloodTIVData: jest.fn(() => {
    return {
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
      error: null,
    };
  }),
}));
const mockPerilData = [
  { accTitle: 'Flood' },
  { accTitle: 'Wind' },
  { accTitle: 'Earth Movement' },
];
jest.mock('src/common/contexts/HeaderContext', () => ({
  __esModule: true,
  useHeader: jest.fn(() => ({
    activeModule: 'dfd',
    setActiveModule: jest.fn(),
    activeTab: 0,
    setActiveTab: jest.fn(),
  })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
  useLocation: () => ({
    pathname: '/',
  }),
}));
jest.mock('@btp/shared-ui', () => ({
  ...jest.requireActual('@btp/shared-ui'),
  useShellNavigation: jest.fn(() => {
    return {
      navigateToBoB: jest.fn(),
    };
  }),
  RiskStatus: {},
  NATURAL_HAZARDS_FLOOD_ENABLED: 'natural-hazards-flood-enabled',
  NATURAL_HAZARDS_WIND_ENABLED: 'natural-hazards-wind-enabled',
  NATURAL_HAZARDS_EARTHQUAKE_ENABLED: 'natural-hazards-earthquake-enabled',
})),
  jest.mock('src/common/contexts/RouteParamsContext', () => ({
    __esModule: true,
    useRouteParams: jest.fn(() => {
      return { routeParams: {}, setRouteParams: jest.fn() };
    }),
  }));

jest.mock('src/common/components/RightUtilityBar', () => ({
  __esModule: true,
  RightUtilityBar: () => null,
}));

jest.mock('src/common/contexts/AccountContext', () => ({
  __esModule: true,
  useAccount: jest.fn(() => {
    return { accountDetails: {} };
  }),
}));

describe('NatHaz Overview Component', () => {
  it('NatHaz overview page are rendered successfully', () => {
    render(<NatHazOverview />);
    expect(screen.getByTestId('overview')).toBeDefined();
  });

  it('Flood module available', () => {
    mockFlags({ NATURAL_HAZARDS_FLOOD_ENABLED: true });
    const { getByText } = render(<NatHazOverview />);
    const floodLink = getByText('Flood');
    expect(floodLink).toBeInTheDocument();
  });

  it('Navigate to flood page when flood link is clicked', async () => {
    mockFlags({ NATURAL_HAZARDS_FLOOD_ENABLED: true });
    const { getByText } = render(<NatHazOverview />);
    const floodLink = getByText('Flood').closest('rds-link');
    if (floodLink) {
      await waitFor(() => userEvent.click(floodLink));
      await expect(mockUsedNavigate).toHaveBeenCalledWith('/undefined/flood');
    }
  });

  it('Wind module available', () => {
    mockFlags({ NATURAL_HAZARDS_WIND_ENABLED: true });
    const { getByText } = render(<NatHazOverview />);
    const floodLink = getByText('Wind');
    expect(floodLink).toBeInTheDocument();
  });

  it('Navigate to wind page when wind link is clicked', async () => {
    mockFlags({ NATURAL_HAZARDS_WIND_ENABLED: true });
    const { getByText } = render(<NatHazOverview />);
    const windLink = getByText('Wind').closest('rds-link');
    if (windLink) {
      await waitFor(() => userEvent.click(windLink));
      await expect(mockUsedNavigate).toHaveBeenCalledWith('/undefined/wind');
    }
  });

  it('Earth-Movement module available', () => {
    mockFlags({ NATURAL_HAZARDS_EARTHQUAKE_ENABLED: true });
    const { getByText } = render(<NatHazOverview />);
    const earthmovementLink = getByText('Earth Movement');
    expect(earthmovementLink).toBeInTheDocument();
  });

  it('Navigate to earth movement page when earth movement link is clicked', async () => {
    mockFlags({ NATURAL_HAZARDS_EARTHQUAKE_ENABLED: true });
    const { getByText } = render(<NatHazOverview />);
    const earthmovementLink = getByText('Earth Movement').closest('rds-link');
    if (earthmovementLink) {
      await waitFor(() => userEvent.click(earthmovementLink));
      await expect(mockUsedNavigate).toHaveBeenCalledWith(
        '/undefined/earth-movement',
      );
    }
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
