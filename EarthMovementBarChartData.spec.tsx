import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EarthMovementBarChartWrapper from './EarthMovementBarChartWrapper';

const mockResponse = [
  {
    region_description: 'Region 1',
    active_location_count: 10,
    activeTIV: 100000,
    prospectTIV: 200000,
    zone: 'Zone 1',
  },
  {
    region_description: 'Region 2',
    active_location_count: 5,
    activeTIV: 50000,
    prospectTIV: 150000,
    zone: 'Zone 2',
  },
];

describe('EarthMovementBarChart', () => {
  it('should render the EarthMovementBarChart component', () => {
    const { getByText } = render(
      <EarthMovementBarChartWrapper
        EarthMovementBarData={mockResponse}
        EarthMovementAccordionData={{}}
        error={null}
      />
    );

    expect(getByText('Earth Movement')).toBeInTheDocument();
    expect(getByText('Region 1')).toBeInTheDocument();
    expect(getByText('Region 2')).toBeInTheDocument();
    expect(getByText('Zone 1')).toBeInTheDocument();
    expect(getByText('Zone 2')).toBeInTheDocument();
  });

  it('should correctly calculate TIV', () => {
    const { getByText } = render(
      <EarthMovementBarChartWrapper
        EarthMovementBarData={mockResponse}
        EarthMovementAccordionData={{}}
        error={null}
      />
    );

    expect(getByText('24')).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    const { getByText } = render(
      <EarthMovementBarChartWrapper
        EarthMovementBarData={[]}
        EarthMovementAccordionData={{}}
        error={null}
      />
    );

    expect(getByText('Earth Movement')).toBeInTheDocument();
  });

  it('should render error message when there is an error', () => {
    const { getByText } = render(
      <EarthMovementBarChartWrapper
        EarthMovementBarData={[]}
        EarthMovementAccordionData={{}}
        error="Error loading data"
      />
    );

    expect(getByText('Error loading data')).toBeInTheDocument();
  });
});
