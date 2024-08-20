import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ACEModal from './ACEModal';

const setIncludeProspect = jest.fn()
const setIsAceModalOpen = jest.fn()

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useApolloClient:jest.fn(() => ({
    cache: {
      modify: jest.fn(),
      gc: jest.fn(),
    },
    clearStore: jest.fn().mockResolvedValue({}),
  })),
}));

jest.mock('src/common/contexts/HeaderContext', () => ({
  __esModule: true,
  useHeader: jest.fn(() => ({
    setAcesExpandedPerils: jest.fn(),
    setAcesIncludeProspect: jest.fn(),
    setAcesLastRunDate: jest.fn(),
    asofDate: new Date(),
    setActiveAccordions: jest.fn(),
  })),
}));

describe('ACEModal component', () => {

  it('ACEModal is rendered successfully', () => {
    render(<ACEModal includeProspect={false} setIncludeProspect={setIncludeProspect} setIsAceModalOpen={setIsAceModalOpen} />)
    expect(screen.getByTestId('ace-modal')).toBeDefined();
  })
  it('should render all checkboxes and all checkboxes should be checked initially', () => {
    const { container } = render(<ACEModal includeProspect={false} setIncludeProspect={setIncludeProspect} setIsAceModalOpen={setIsAceModalOpen} />)
    const checkBoxes = container.querySelectorAll('rds-checkbox');
    expect(checkBoxes.length).toBe(3);
    checkBoxes.forEach(checkbox => {
      expect(checkbox).toHaveAttribute('checked')
    })
  })
  it('should disable button when all checkboxes are deselected and enabled when atleast one checkbox is selected', async () => {
    const { container, getByTestId } = render(<ACEModal includeProspect={false} setIncludeProspect={setIncludeProspect} setIsAceModalOpen={setIsAceModalOpen} />)
    const checkBoxes = container.querySelectorAll('rds-checkbox');
    await waitFor(() => {
      checkBoxes.forEach(checkbox => {
        userEvent.click(checkbox)
      })
      expect(getByTestId('ace-run')).toBeDisabled();
      expect(container.querySelector('rds-toggle')).toBeDisabled();
    })
    userEvent.click(checkBoxes[0]);
    await waitFor(() => {
      expect(getByTestId('ace-run')).toBeEnabled();
      expect(container.querySelector('rds-toggle')).toBeEnabled();
    })
  })
  it('should display the loader when run button is clicked', async () => {
    const { container, getByTestId } = render(<ACEModal includeProspect={false} setIncludeProspect={setIncludeProspect} setIsAceModalOpen={setIsAceModalOpen} />)
    const runButton = getByTestId('ace-run');
    await waitFor(() => {
      userEvent.click(runButton)
      expect(container.querySelector('rds-spinner')).toBeInTheDocument()
    })
  })
});
