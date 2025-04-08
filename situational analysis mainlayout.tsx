import { useAccount } from 'src/common/contexts/AccountContext';
import { Props } from 'src/common/interfaces';
import { BtpUtilityBar } from 'btp_product_suite/shared-components';
import { useUserContext } from 'src/common/contexts/UserContext';
import { UserGroup } from '@btp/shared-ui';
import { NavigationHeader } from '../NavigationHeader/NavigationHeader';

export default function MainLayout({ children }: Readonly<Props>) {
  const { orgId } = useAccount();
  const userContext = useUserContext();
  const isReadOnlyUser = !userContext?.isInGroup([
    UserGroup.PrimaryWorkflowUser,
  ]);

  return (
    <>
      <NavigationHeader orgId={orgId} />
      <div
        data-testid="main-content-section"
        id="main-section"
        slot="app-main"
        className="p-0 m-0 overflow-x-hidden overflow-y-auto bg-slate-50"
      >
        {children}
      </div>
      <div id="right-utility-bar">
        <BtpUtilityBar isNotesReadOnly={isReadOnlyUser} />
      </div>
    </>
  );
}
