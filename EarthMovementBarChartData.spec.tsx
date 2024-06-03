import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { calculateTIV, createBarChart, getEarthMovementBarData, getEarthMovementRegionData, CreateEarthMovementBarChart } from './EarthMovementBarChart';
import { formatAmount } from 'src/mappers/natHazMappers';
import { BarChart, RiskStatus, TableList } from '@btp/shared-ui';

// Mock dependencies
jest.mock('shared-ui/src/lib/Highcharts/BarChart/colorThemes', () => ({
  ColorThemes: {
    Prospect: 'ProspectTheme',
    Active: 'ActiveTheme'
  }
}));
jest.mock('src/mappers/natHazMappers', () => ({
  formatAmount: jest.fn((amount: number) => `$${amount.toFixed(2)}`)
}));
jest.mock('src/NatHazOverview/NatHazOverview.mock', () => ({
  actionsMock: jest.fn()
}));

describe('EarthMovementBarChart Utilities', () => {
  const mockResponses = [
    { zone: 'zone1', activeTIV: 100, active_locations: 10, prospectTIV: 200, prospect_locations: 20 },
    { zone: 'zone2', activeTIV: 300, active_locations: 30, prospectTIV: 400, prospect_locations: 40 }
  ];

  describe('calculateTIV', () => {
    it('calculates TIV percentage correctly for active type', () => {
      const tiv = calculateTIV(mockResponses, mockResponses[0], 'active');
      expect(tiv).toBe('25.00');
    });

    it('calculates TIV percentage correctly for prospect type', () => {
      const tiv = calculateTIV(mockResponses, mockResponses[1], 'prospect');
      expect(tiv).toBe('66.67');
    });
  });

  describe('createBarChart', () => {
    const mockActiveZoneData = [
      { barValue: 100 },
      { barValue: 200 }
    ];
    const mockProspectZoneData = [
      { barValue: 300 },
      { barValue: 400 }
    ];

    it('creates bar chart data correctly', () => {
      const { activeEarthMovementBarChart, prospectEarthMovementBarChart } = createBarChart(mockActiveZoneData, mockProspectZoneData);
      expect(activeEarthMovementBarChart).toBeDefined();
      expect(prospectEarthMovementBarChart).toBeDefined();
    });
  });

  describe('getEarthMovementBarData', () => {
    it('processes response correctly to aggregate data', () => {
      const { activezoneData, prospectzoneData } = getEarthMovementBarData(mockResponses);
      expect(activezoneData.length).toBe(2);
      expect(prospectzoneData.length).toBe(4); // because it includes both active and prospect
    });
  });

  describe('getEarthMovementRegionData', () => {
    const mockRegionResponse = [
      { region_code: 'region1', region_description: 'Region 1', activeTIV: 100, active_location_count: 10, prospectTIV: 200, prospect_location_count: 20 },
      { region_code: 'region2', region_description: 'Region 2', activeTIV: 300, active_location_count: 30, prospectTIV: 400, prospect_location_count: 40 }
    ];

    it('processes response correctly to aggregate region data', () => {
      const { regionActiveTable, regionProspectTable } = getEarthMovementRegionData(mockRegionResponse);
      expect(regionActiveTable.length).toBe(2);
      expect(regionProspectTable.length).toBe(2);
    });
  });

  describe('CreateEarthMovementBarChart', () => {
    const mockBarData = [
      { zone: 'zone1', activeTIV: 100, active_locations: 10, prospectTIV: 200, prospect_locations: 20 },
      { zone: 'zone2', activeTIV: 300, active_locations: 30, prospectTIV: 400, prospect_locations: 40 }
    ];
    const mockAccordionData = [
      { region_code: 'region1', region_description: 'Region 1', activeTIV: 100, active_location_count: 10, prospectTIV: 200, prospect_location_count: 20 },
      { region_code: 'region2', region_description: 'Region 2', activeTIV: 300, active_location_count: 30, prospectTIV: 400, prospect_location_count: 40 }
    ];

    it('creates Earth Movement Bar Chart data correctly', () => {
      const result = CreateEarthMovementBarChart(mockBarData, mockAccordionData);
      expect(result.length).toBe(2);
      expect(result[0].accTitle).toBe('Earth Movement');
      expect(result[0].status).toBe(RiskStatus.SEVERE);
      expect(result[0].accComp).toBeDefined();
      expect(result[0].accItemComp).toBeDefined();
      expect(result[1].accComp).toBeDefined();
      expect(result[1].accItemComp).toBeDefined();
    });
  });
});
