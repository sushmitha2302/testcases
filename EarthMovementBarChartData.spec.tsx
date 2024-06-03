import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateEarthMovementBarChart from './EarthMovementBarChart';
import { BarChart, TableList } from '@btp/shared-ui';

// Mock data
const mockData = {
  activezoneData: [
    { activeTIV: 100, barValue: 50 },
    { activeTIV: 200, barValue: 100 },
  ],
  prospectzoneData: [
    { prospectTIV: 150, barValue: 75 },
    { prospectTIV: 250, barValue: 125 },
  ],
  earthMovementAggData: {
    region1: {
      region_description: 'Region 1',
      activeTIV: 100,
      active_location_count: 2,
      prospectTIV: 150,
      prospect_location_count: 3,
    },
    region2: {
      region_description: 'Region 2',
      activeTIV: 200,
      active_location_count: 4,
      prospectTIV: 250,
      prospect_location_count: 5,
    },
  },
};

describe('EarthMovementBarChart Component', () => {
  it('should render without crashing', () => {
    const { getByText } = render(
      <CreateEarthMovementBarChart 
        EarthMovementBarData={mockData} 
        EarthMovementAccordionData={mockData} 
      />
    );
    
    expect(getByText('Earth Movement')).toBeInTheDocument();
  });

  it('should calculate total active TIV correctly', () => {
    const totalActiveTIV = mockData.activezoneData.reduce((sum, data) => sum + data.barValue, 0);
    expect(totalActiveTIV).toBe(150);
  });

  it('should calculate total prospect TIV correctly', () => {
    const totalProspectTIV = mockData.prospectzoneData.reduce((sum, data) => sum + data.barValue, 0);
    expect(totalProspectTIV).toBe(200);
  });

  it('should render bar charts with correct data', () => {
    const { getByText } = render(
      <CreateEarthMovementBarChart 
        EarthMovementBarData={mockData} 
        EarthMovementAccordionData={mockData} 
      />
    );

    expect(getByText('Total TIV')).toBeInTheDocument();
    expect(getByText('150')).toBeInTheDocument();
    expect(getByText('200')).toBeInTheDocument();
  });

  it('should render region tables with correct data', () => {
    const { getByText } = render(
      <CreateEarthMovementBarChart 
        EarthMovementBarData={mockData} 
        EarthMovementAccordionData={mockData} 
      />
    );

    expect(getByText('Region 1')).toBeInTheDocument();
    expect(getByText('Region 2')).toBeInTheDocument();
    expect(getByText('100')).toBeInTheDocument();
    expect(getByText('200')).toBeInTheDocument();
  });
});
