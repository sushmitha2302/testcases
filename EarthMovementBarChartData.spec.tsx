import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateEarthMovementBarChart from './EarthMovementBarChart';

// Mock dependencies
jest.mock('shared-ui/src/lib/HighCharts/BarChart/colorThemes', () => ({
  ColorThemes: {
    Prospect: 'ProspectTheme',
    Active: 'ActiveTheme'
  }
}));
jest.mock('src/mappers/natHazMappers', () => ({
  formatAmount: (amount: number) => `$${amount.toFixed(2)}`
}));
jest.mock('src/NatHazOverview/NatHazOverview.mock', () => ({
  actionsMock: jest.fn()
}));

describe('CreateEarthMovementBarChart', () => {
  const mockResponses = [
    {
      zone: 'zone1',
      activeTIV: 100,
      active_locations: 10,
      prospectTIV: 200,
      prospect_locations: 20
    },
    {
      zone: 'zone2',
      activeTIV: 300,
      active_locations: 30,
      prospectTIV: 400,
      prospect_locations: 40
    }
  ];

  it('should calculate TIV correctly', () => {
    const tiv = calculateTIV(mockResponses, mockResponses[0], 'active');
    expect(tiv).toBe('33.33');
  });

  it('should render active Earth Movement Bar Chart correctly', () => {
    render(<CreateEarthMovementBarChart EarthMovementBarData={mockResponses} />);
    expect(screen.getByText('Earth Movement')).toBeInTheDocument();
    expect(screen.getByText('Total TIV')).toBeInTheDocument();
  });

  it('should render prospect Earth Movement Bar Chart correctly', () => {
    render(<CreateEarthMovementBarChart EarthMovementBarData={mockResponses} />);
    expect(screen.getByText('Total TIV')).toBeInTheDocument();
    expect(screen.getByText('$600.00')).toBeInTheDocument(); // Summed total TIV
  });

  it('should create region table correctly', () => {
    render(<CreateEarthMovementBarChart EarthMovementBarData={mockResponses} />);
    expect(screen.getByText('Earth Movement')).toBeInTheDocument();
    expect(screen.getByText('Region')).toBeInTheDocument();
    expect(screen.getByText('TIV')).toBeInTheDocument();
  });

  // Add more tests for each functionality and line of code
});
