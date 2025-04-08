import {
  App,
  DatePickerDropdown,
  RISK_TRANSFER_NAVIGATION_ENABLED,
} from '@btp/shared-ui';
import {
  RdsButton,
  RdsHeroIcon,
  RdsMenu,
  RdsMenuItem,
} from 'rds-components-react';
import { useEffect, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useSearchParams } from 'react-router-dom';
import { Spa, Spas } from 'src/common/utils/constants';
import useGetAccountData from 'src/hooks/useGetAccountData';
import {
  BtpUtilityBar,
  BtpAccountHeader,
} from 'btp_product_suite/shared-components';
import useReadOnlyAccess from 'src/hooks/useReadOnlyAccess';
import { useAccountData } from '../contexts/AccountDetailsStorageProvider';
import { useAsOfDate } from '../contexts/AsOfDateProvider';
import { Props } from '../interfaces/interfaces';
import { SubHeader } from './SubHeader';
import { AggregateHeader } from './AggregateHeader';
import { useCurrency } from '../contexts/CurrencyProvider';
import { ContextTabs } from '../../ContextTabs';
import { useTableData } from '../contexts/LocationGridProvider';

export default function MainLayout({ children }: Readonly<Props>) {
  useGetAccountData();
  const readOnly = useReadOnlyAccess();
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [searchParams] = useSearchParams();

  const { accObject } = useAccountData();
  const { currencies, renewalStartDate, includeProspects } = accObject;
  const { asOfDate, changeAsOfDate, setInitialAsOfDate } = useAsOfDate();
  const { notesData } = useTableData();
  const { currency, setCurrencyValue } = useCurrency();
  const flags = useFlags();
  const riskTransferEnabled = flags[RISK_TRANSFER_NAVIGATION_ENABLED];
  const extendedSpas = [...Spas];
  if (riskTransferEnabled) {
    extendedSpas.push(Spa.RiskTransfer);
  }

  // Remove the asOfDate query string from the URL and set the date in the state.
  useEffect(() => {
    const asOfDateQueryString = searchParams.get('asOfDate') as string;
    if (searchParams.has('asOfDate')) {
      // Adjusted the date due to ISO formatting.
      const adjustedDate = new Date(asOfDateQueryString);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      changeAsOfDate(new Date(adjustedDate));
    } else if (isInitialLoad) {
      setInitialAsOfDate(renewalStartDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, renewalStartDate]);

  const onDateChange = (selectedDate: Date) => {
    setIsInitialLoad(false);
    changeAsOfDate(selectedDate);
  };

  return (
    <>
      <div>
        <BtpAccountHeader
          activeApp={App.Values}
          asOfDate={convertDateToJson(asOfDate) ?? undefined}
          currency={currency ?? undefined}
          includeProspects={includeProspects ?? undefined}
          rightChildren={[
            <div key="rchild1">
              <SubHeader />
            </div>,
            <div key="rchild2">
              <DatePickerDropdown
                value={asOfDate}
                onChange={(v: Date) => onDateChange(v)}
              />
            </div>,
            <div key="rchild3" data-testid="currency-container">
              <RdsMenu>
                <RdsButton
                  appearance="tertiary"
                  className="w-full"
                  slot="menu-trigger"
                >
                  {currency && currencies
                    ? currencies.find((c) => c.id === currency.id)?.code
                    : null}
                  <RdsHeroIcon name="chevron-down" slot="end" />
                </RdsButton>
                <div slot="menu-content" data-testid="currency-items">
                  {currencies.map((cur) => (
                    <RdsMenuItem
                      key={cur.id}
                      onRdsMenuItemSelect={() => setCurrencyValue(cur)}
                    >
                      {cur.code}
                    </RdsMenuItem>
                  ))}
                </div>
              </RdsMenu>
            </div>,
          ]}
        />
        <AggregateHeader />
      </div>
      <div className="flex flex-col m-0 h-full">
        <div className="flex grow">
          <div className="h-full p-8 pb-16 m-auto grow">{children}</div>
          <div className="h-full" id="right-side-panel" />
          <div className="h-full bottom-0 w-fit z-10">
            <BtpUtilityBar data={{ notesData }} isNotesReadOnly={readOnly} />
          </div>
        </div>
        <ContextTabs />
      </div>
    </>
  );
}
