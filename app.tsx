import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingComp from 'src/common/components/LoadingComp';
import MainLayout from 'src/common/components/MainLayout';
import ContextProviders from 'src/common/contexts/ContextProviders';
import {
  BTP_NATURAL_HAZARDS_ACCESS_ROLES,
  permissionsTable,
} from 'src/common/utils/x-hasura-role';
import { MainRoutes } from 'src/routes/MainRoutes';
import { TypePolicies } from '@apollo/client';
// Importing this here to initialize i18next - it is here instead of in main.ts due to module federation
import {
  BtpApolloProvider,
  BtpTelemetry,
  LaunchDarklyContextProvider,
  PlatformProps,
  setupAggridLicense,
} from '@btp/shared-ui';
import { TelemetryLogLevel } from 'shared-ui/src/lib/BtpTelemetry';
import { ErrorFallback } from '../common/components/ErrorFallback';
// Import the global styles - needed for module federation
import '../styles.scss';
import './app.module.scss';
setupAggridLicense();
const typePolicies: TypePolicies = {
  Query: {
    fields: {
      latest_prospect_clients: {
        keyArgs: ['where'],
        // The incoming can be any type (as recommended by the docs)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        merge(existing, incoming: any[], { mergeObjects }) {
          // If there's no data, replace the cache
          // If the data doesn't align with what is expected, replace the cache
          if (existing?.length !== 1 || incoming?.length !== 1) {
            return incoming;
          }
          const mergedAccountAttributes = mergeObjects(
            existing[0].btp_account_attributes ?? {},
            incoming[0].btp_account_attributes ?? {},
          );
          return [
            {
              ...mergeObjects(existing[0], incoming[0]),
              btp_account_attributes: mergedAccountAttributes,
            },
          ];
        },
      },
      btp_natural_hazards: {
        merge: true,
      },
    },
  },
};
export function App({ useSetPlatformState }: Readonly<PlatformProps>) {
  const { setPlatformConfiguration } = useSetPlatformState();
  useEffect(
    () =>
      setPlatformConfiguration({
        accountSelector: false,
        header: false,
        navigation: false,
      }),
    [setPlatformConfiguration],
  );
  const availableBtpRoles = BTP_NATURAL_HAZARDS_ACCESS_ROLES;
  const fallbackURL = 'http://localhost:8080/v1/graphql';
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BtpTelemetry
        serviceName={process.env.NX_DYNATRACE_APP_NAME as string}
        environment={process.env.NX_DYNATRACE_ENVIRONMENT as string}
        localOnlyMode={process.env.NX_DYNATRACE_IS_LOCAL_ONLY === 'true'}
        allowedTraceUrls={[
          process.env.NX_REACT_APP_GRAPHQL_API_URL as unknown as RegExp,
        ]}
        minimumLogLevel={
          process.env
            .NX_DYNATRACE_MINIMUM_LOG_LEVEL as unknown as TelemetryLogLevel
        }
        logToConsole={process.env.NX_DYNATRACE_LOG_TO_CONSOLE === 'true'}
      >
        <BtpApolloProvider
          casUrl={process.env.NX_CAS_API_URL ?? ''}
          clientName={process.env.NX_REACT_APP_APPLICATION_NAME ?? ''}
          hasuraUrl={process.env.NX_REACT_APP_GRAPHQL_API_URL || fallbackURL}
          organizationRoles={availableBtpRoles}
          queryToRoleMap={permissionsTable}
          rolesLoadingComponent={<LoadingComp />}
          shouldUseMockCAS={process.env.NX_CAS_USE_MOCK_AUTH === 'true'}
          shouldUsePlainId
          cacheTypePolicies={typePolicies}
        >
          <LaunchDarklyContextProvider>
            <ContextProviders>
              <MainLayout>
                <MainRoutes />
              </MainLayout>
            </ContextProviders>
          </LaunchDarklyContextProvider>
        </BtpApolloProvider>
      </BtpTelemetry>
    </ErrorBoundary>
  );
}
export default App;
