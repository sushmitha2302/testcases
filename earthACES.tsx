import { useMutation } from '@apollo/client';
import {
  BtpNaturalHazards_CreateEarthMovementExposure_V01Document,
  BtpNaturalHazards_CreateEarthMovementExposure_V01Mutation,
} from 'src/models';
import { useAccount } from 'src/common/contexts/AccountContext';
import { useCallback } from 'react';
import {
  convertDateToJson,
  EarthMovementAreasOfCommonExposureDTO,
} from '@btp/shared-ui';
import { useHeader } from 'src/common/contexts/HeaderContext';
import { projectErrorCode } from 'src/common/utils/projectErrorCode';

export const CreateEarthMovementAreasOfCommonExposures = () => {
  const [mutation] =
    useMutation<BtpNaturalHazards_CreateEarthMovementExposure_V01Mutation>(
      BtpNaturalHazards_CreateEarthMovementExposure_V01Document,
    );
  return mutation;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getEarthMovementAccumulations = (EM_Accumulations: any) => {
  if (EM_Accumulations == null) {
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return EM_Accumulations.map((EmAccumulation: any) => {
    const res = {
      identifier: EmAccumulation.identifier,
      locations: EmAccumulation.locations.length,
      EMSeverity: EmAccumulation.severity,
      tiv: EmAccumulation.total_insured_value,
      largestTIV: EmAccumulation.largest_total_insured_value,
    };
    return res;
  });
};

export const useCreateEarthMovementAreasOfCommonExposures = () => {
  const { accountDetails } = useAccount();
  const { orgid } = accountDetails;
  const { selectedCurrency, asofDate } = useHeader();
  const mutation = CreateEarthMovementAreasOfCommonExposures();

  return useCallback(
    async (prospect: boolean) => {
      const { data, errors } = await mutation({
        variables: {
          org_prospect_client_id: orgid,
          as_of_date: convertDateToJson(asofDate),
          context_currency_type_id: selectedCurrency,
          include_prospects: prospect,
        },
        errorPolicy: 'all',
      });
      const earthMovementAreasofCommonExposure =
        data?.btp_natural_hazards?.create_earth_movement_exposure;

      const EarthMovementAreasOfCommonExposureData: EarthMovementAreasOfCommonExposureDTO | null =
        earthMovementAreasofCommonExposure == null
          ? null
          : {
              earth_movement_exposure_id:
                earthMovementAreasofCommonExposure.earth_movement_exposure_id,
              org_prospect_client_id:
                earthMovementAreasofCommonExposure.org_prospect_client_id,
              as_of_date: earthMovementAreasofCommonExposure.as_of_date,
              currency_type_id:
                earthMovementAreasofCommonExposure.currency_type_id,
              create_date: earthMovementAreasofCommonExposure.create_time,
              prospects_included:
                earthMovementAreasofCommonExposure.prospects_included,
              em_accumulations: getEarthMovementAccumulations(
                earthMovementAreasofCommonExposure.earth_movement_accumulations,
              ),
            };

      return {
        EarthMovementAreasOfCommonExposureData,
        errorCode: projectErrorCode(errors),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orgid, mutation, asofDate, selectedCurrency],
  );
};

export default useCreateEarthMovementAreasOfCommonExposures;
