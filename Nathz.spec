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
