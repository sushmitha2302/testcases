/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart, RiskStatus, TableList } from '@btp/shared-ui';
import React from 'react';
import { ColorThemes } from 'shared-ui/src/lib/Highcharts/BarChart/colorThemes';
import { actionsMock } from 'src/NatHazOverview/NatHazOverview.mock';
import { formatAmount } from 'src/mappers/natHazMappers';

// eslint-disable-next-line consistent-return
export const calculateTIV = (responses: any, res: any, type: string) => {
  if (type === 'active') {
    const totalActiveTIV: number = responses.reduce(
      (sum: any, data: { activeTIV: number }) => sum + data.activeTIV || 0,
      0,
    );
    const tivPercentage =
      totalActiveTIV === 0
        ? 0
        : ((res.activeTIV / totalActiveTIV) * 100).toFixed(2);
    return tivPercentage;
  }
  if (type === 'prospect') {
    const totalProspectTIV: number = responses.reduce(
      (sum: any, data: { prospectTIV: number }) => sum + data.prospectTIV || 0,
      0,
    );
    const tivPercentage =
      totalProspectTIV === 0
        ? 0
        : ((res.prospectTIV / totalProspectTIV) * 100).toFixed(2);
    return tivPercentage;
  }
};

export const createBarChart = (activezoneData: any, prospectzoneData: any) => {
  const totalProspectTIV: number = prospectzoneData.reduce(
    (sum: any, data: { barValue: any }) => sum + data.barValue,
    0,
  );
  const totalActiveTIV: number = activezoneData.reduce(
    (sum: any, data: { barValue: any }) => sum + data.barValue,
    0,
  );

  const prospectEarthMovementBarChart = React.createElement(BarChart, {
    barData: prospectzoneData,
    rightContent: [
      { label: 'Total TIV', value: formatAmount(totalProspectTIV) },
    ],
    theme: ColorThemes.Prospect,
    total: totalProspectTIV,
  });
  const activeEarthMovementBarChart = React.createElement(BarChart, {
    barData: activezoneData,
    rightContent: [{ label: 'Total TIV', value: formatAmount(totalActiveTIV) }],
    theme: ColorThemes.Active,
    total: totalActiveTIV,
  });

  return { activeEarthMovementBarChart, prospectEarthMovementBarChart };
};

export const earthMovementColumnAccordionData = [
  { key: 'region', header: 'Region' },
  { key: 'locations', header: 'Locations' },
  { key: 'tiv', header: 'TIV' },
  { key: 'tiv_percentage', header: '% Of TIV' },
];

export const getEarthMovementBarData = (response: any) => {
  const earthMovementAggData = response.reduce((res: any, curr: any) => {
    if (!res[curr.zone]) {
      res[curr.zone] = {
        activeTIV: 0,
        active_locations: 0,
        prospectTIV: 0,
        prospect_locations: 0,
      };
    }
    res[curr.zone].activeTIV += curr.activeTIV;
    res[curr.zone].active_locations += curr.active_locations;
    res[curr.zone].prospectTIV += curr.prospectTIV;
    res[curr.zone].prospect_locations += curr.prospect_locations;
    return res;
  }, {});

  const activezoneData = Object.keys(earthMovementAggData).map((zone: any) => {
    const active = {
      label: `Zone ${zone}`,
      barValue: earthMovementAggData[zone]?.activeTIV,
      legendValue: formatAmount(earthMovementAggData[zone].activeTIV),
    };
    return active;
  });

  const prospectzoneData = Object.keys(earthMovementAggData).reduce(
    (result: any, zone: any) => {
      const active = {
        label: `Zone ${zone}`,
        barValue: earthMovementAggData[zone]?.activeTIV,
        legendValue: formatAmount(earthMovementAggData[zone]?.activeTIV),
      };
      const prospect = {
        label: `Zone ${zone}`,
        barValue: earthMovementAggData[zone]?.prospectTIV,
        legendValue: formatAmount(earthMovementAggData[zone]?.prospectTIV),
        pattern: true,
      };
      result.push(active);
      result.push(prospect);
      return result;
    },
    [],
  );

  return { activezoneData, prospectzoneData };
};

export const getEarthMovementRegionData = (response: any) => {
  const earthMovementAggRegionData = response.reduce((res: any, curr: any) => {
    if (!res[curr.region_code]) {
      res[curr.region_code] = {
        region_description: curr?.region_description || '',
        activeTIV: 0,
        active_location_count: 0,
        prospectTIV: 0,
        prospect_location_count: 0,
      };
    }
    res[curr.region_code].activeTIV += curr.activeTIV;
    res[curr.region_code].active_location_count += curr.active_location_count;
    res[curr.region_code].prospectTIV += curr.prospectTIV;
    res[curr.region_code].prospect_location_count +=
      curr.prospect_location_count;
    return res;
  }, {});

  const regionActiveTable = Object.keys(earthMovementAggRegionData).map(
    (region: any) => {
      const regionObj = {
        region: earthMovementAggRegionData[region].region_description,
        locations: earthMovementAggRegionData[region]?.active_location_count,
        tiv: new Intl.NumberFormat('en-US').format(
          earthMovementAggRegionData[region]?.activeTIV,
        ),
        tiv_percentage: calculateTIV(
          response,
          earthMovementAggRegionData[region],
          'active',
        ),
      };
      return regionObj;
    },
  );
  const regionProspectTable = Object.keys(earthMovementAggRegionData).map(
    (region: any) => {
      const regionObj = {
        region: earthMovementAggRegionData[region].region_description,
        locations: earthMovementAggRegionData[region]?.prospect_location_count,
        tiv: new Intl.NumberFormat('en-US').format(
          earthMovementAggRegionData[region]?.prospectTIV,
        ),
        tiv_percentage: calculateTIV(
          response,
          earthMovementAggRegionData[region],
          'prospect',
        ),
      };
      return regionObj;
    },
  );
  return { regionActiveTable, regionProspectTable };
};

/**
 * createRegionTable function will prepare regionTable element
 * with earthmovementregionTable, columnMock and actionsMock
 * @param { Array } earthmovementregionTable
 * @returns regionTable
 */
const createRegionTable = (
  regionActiveTable: any,
  regionProspectTable: any,
) => {
  const regionActiveTableElement = React.createElement(TableList, {
    tableTitle: 'Earth Movement',
    tableData: regionActiveTable,
    columnData: earthMovementColumnAccordionData,
    actions: actionsMock,
    viewAllButton: true,
  });

  const regionProspectTableElement = React.createElement(TableList, {
    tableTitle: 'Earth Movement',
    tableData: regionProspectTable,
    columnData: earthMovementColumnAccordionData,
    actions: actionsMock,
    viewAllButton: true,
  });

  return { regionActiveTableElement, regionProspectTableElement };
};

/**
 * CreateEarthMovementBarChart will create barchart elements
 * @param { Array } EarthMovementBarData
 * @param { Object } error
 * @returns list with earthMovementBarChart elements
 */
export function CreateEarthMovementBarChart(
  EarthMovementBarData: any,
  EarthMovementAccordionData: any,
) {
  const { activezoneData, prospectzoneData } =
    getEarthMovementBarData(EarthMovementBarData);
  const { activeEarthMovementBarChart, prospectEarthMovementBarChart } =
    createBarChart(activezoneData, prospectzoneData);
  const { regionActiveTable, regionProspectTable } = getEarthMovementRegionData(
    EarthMovementAccordionData,
  );
  const { regionActiveTableElement, regionProspectTableElement } =
    createRegionTable(regionActiveTable, regionProspectTable);
  return [
    {
      accTitle: 'Earth Movement',
      status: RiskStatus.SEVERE,
      accComp: prospectEarthMovementBarChart,
      accItemComp: regionProspectTableElement,
    },
    {
      accTitle: 'Earth Movement',
      status: RiskStatus.SEVERE,
      accComp: activeEarthMovementBarChart,
      accItemComp: regionActiveTableElement,
    },
  ];
}

export default CreateEarthMovementBarChart;
