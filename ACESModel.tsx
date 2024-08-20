import {
  RdsButton,
  RdsCheckbox,
  RdsCheckboxGroup,
  RdsModal,
  RdsSpinner,
  RdsText,
  RdsToggle,
} from 'rds-components-react';
import { useState } from 'react';
import { useHeader } from 'src/common/contexts/HeaderContext';
import { perilList } from 'src/common/utils/constants/constants';
import { useApolloClient } from '@apollo/client';
interface IACEModalProps {
  setIsAceModalOpen: (status: boolean) => void;
  includeProspect: boolean;
  setIncludeProspect: (status: boolean) => void;
}
export function ACEModal({
  setIsAceModalOpen,
  includeProspect,
  setIncludeProspect,
}: Readonly<IACEModalProps>) {
  const {
    setAcesExpandedPerils,
    setAcesIncludeProspect,
    setAcesLastRunDate,
    setShouldCreateAces,
    asofDate,
    setActiveAccordions,
  } = useHeader();
  const [loading, setLoading] = useState<boolean>(false);
  const [prospectStatus, setProspectStatus] =
    useState<boolean>(includeProspect);
  const [selectedAcePerils, setSelectedAcePerils] =
    useState<string[]>(perilList);
  const apolloClient = useApolloClient();
  const clearACESCache = () => {
    apolloClient.cache.modify({
      id: 'ROOT_QUERY',
      fields: {
        btp_natural_hazards(existingFields) {
          const result = Object.keys(existingFields).reduce((acc, key) => {
            if (
              key.includes('earth_movement_exposure') ||
              key.includes('flood_exposure') ||
              key.includes('wind_exposure')
            ) {
              return acc;
            }
            return { ...acc, [key]: existingFields[key] };
          }, {});
          return result;
        },
      },
    });
    apolloClient.cache.gc();
    apolloClient
      .clearStore()
      .then(() => {
        // Post ACES store clear actions
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((error) => {
        // Post ACES store clear error if any
      });
  };
  const handleRunClick = () => {
    setLoading(true);
    clearACESCache();
    setTimeout(() => {
      setLoading(false);
      setIncludeProspect(prospectStatus);
      setIsAceModalOpen(false);
      setAcesExpandedPerils(selectedAcePerils);
      setActiveAccordions(selectedAcePerils);
      setAcesIncludeProspect(!prospectStatus);
      setAcesLastRunDate(asofDate);
      setShouldCreateAces(true);
    }, 3000);
  };
  const handleACEPerilSelection = (peril: string) => {
    if (selectedAcePerils.includes(peril)) {
      const updatedList = selectedAcePerils.filter((item) => item !== peril);
      setSelectedAcePerils(updatedList);
    } else {
      setSelectedAcePerils([...selectedAcePerils, peril]);
    }
  };
  return (
    <RdsModal
      closeButton={false}
      headline={loading ? '' : 'Areas of Common Exposure'}
      size="default"
      visible
      onRdsModalClosed={() => setIsAceModalOpen(false)}
      data-testid="ace-modal"
    >
      {loading ? (
        <div className="flex justify-center my-2">
          <div className="flex flex-col items-center">
            <RdsSpinner />
            <RdsText size="sm">Gathering Data...</RdsText>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <RdsCheckboxGroup
              direction="vertical"
              labelPosition="default"
              type="default"
            >
              {perilList.map((peril) => {
                return (
                  <RdsCheckbox
                    key={peril}
                    checked={selectedAcePerils.includes(peril)}
                    label={peril}
                    value={peril}
                    onRdsOnChange={() => handleACEPerilSelection(peril)}
                  />
                );
              })}
            </RdsCheckboxGroup>
            <RdsToggle
              label="Include Prospects"
              switched={prospectStatus}
              disabled={selectedAcePerils.length === 0}
              onRdsSwitchChange={() => {
                setProspectStatus(!prospectStatus);
              }}
              data-testid="ace-toggle"
            />
          </div>
          <div slot="footer">
            <div className="flex justify-end gap-4">
              <RdsButton
                appearance="tertiary"
                onClick={() => setIsAceModalOpen(false)}
                data-testid="ace-cancel"
              >
                Cancel
              </RdsButton>
              <RdsButton
                onClick={handleRunClick}
                disabled={selectedAcePerils.length === 0}
                data-testid="ace-run"
              >
                Run
              </RdsButton>
            </div>
          </div>
        </>
      )}
    </RdsModal>
  );
}
export default ACEModal;
