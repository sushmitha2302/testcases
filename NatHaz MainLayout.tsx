import {
  RdsButton,
  RdsHeroIcon,
  RdsMenu,
  RdsMenuItem,
} from 'rds-components-react';
import {
  DatePickerDropdown,
  RISK_TRANSFER_NAVIGATION_ENABLED,
  App,
} from '@btp/shared-ui';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useHeader } from 'src/common/contexts/HeaderContext';
import { CurrencyType, Props } from 'src/common/interfaces/interfaces';
import {
  SpaEnum,
  Spas,
  defaultCurrencyType,
} from 'src/common/utils/constants/constants';
import { BtpAccountHeader } from 'btp_product_suite/shared-components';
import { NavigationButtons } from './HeaderComponents/NavigationButtons';

export function MainLayout({ children }: Readonly<Props>) {
  const {
    selectedCurrency,
    setSelectedCurrency,
    asofDate,
    setAsofDate,
    currencyList,
    setIsSidebarDisplayed,
    isSidebarDisplayed,
    includeProspect,
  } = useHeader();

  const flags = useFlags();
  const riskTransferEnabled = flags[RISK_TRANSFER_NAVIGATION_ENABLED];
  const extendedSpas = [...Spas];
  if (riskTransferEnabled) {
    extendedSpas.push(SpaEnum.RiskTransfer);
  }

  const onMenuItemCurrencyChange = (currency: CurrencyType) => {
    if (isSidebarDisplayed) {
      setIsSidebarDisplayed(!isSidebarDisplayed);
    }
    setSelectedCurrency(currency.id ?? defaultCurrencyType.id);
  };

  const onDatePickChange = (newDate: Date) => {
    if (isSidebarDisplayed) {
      setIsSidebarDisplayed(false);
    }
    setAsofDate(newDate);
  };

  return (
    <>
      <BtpAccountHeader
        activeApp={App.NaturalHazards}
        asOfDate={convertDateToJson(asOfDate) ?? undefined}
        currency={selectedCurrency ?? undefined}
        includeProspects={includeProspect ?? undefined}
        rightChildren={[
          <div key="togglemenu">
            <NavigationButtons />
          </div>,
          <div key="datepicker">
            <DatePickerDropdown
              onChange={(newDate) => onDatePickChange(newDate)}
              value={asofDate ? new Date(asofDate) : new Date()}
            />
          </div>,
          <div key="currencymenu">
            {selectedCurrency && (
              <RdsMenu>
                <RdsButton
                  appearance="tertiary"
                  className="w-full"
                  slot="menu-trigger"
                  data-testid="currency-dropdown"
                >
                  {selectedCurrency && currencyList
                    ? currencyList.find((c) => c.id === selectedCurrency)?.code
                    : null}
                  <RdsHeroIcon name="chevron-down" slot="end" />
                </RdsButton>
                {currencyList?.map((currency) => (
                  <RdsMenuItem
                    slot="menu-content"
                    key={currency.id}
                    value={currency.code ?? defaultCurrencyType.code}
                    className="pl-5 pr-7 py-3"
                    onRdsMenuItemSelect={() =>
                      onMenuItemCurrencyChange(currency)
                    }
                  >
                    {currency.code}
                  </RdsMenuItem>
                ))}
              </RdsMenu>
            )}
          </div>,
        ]}
      />
      {children}
    </>
  );
}

export default MainLayout;
