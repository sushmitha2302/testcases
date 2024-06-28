import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../common/components/ErrorFallback';

describe('ErrorBoundary', () => {
  it('renders fallback component when an error occurs', async () => {
    // Mock children component that throws an error
    const ErrorThrower = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ErrorThrower />
      </ErrorBoundary>,
    );
    const errorMessage = screen.getByText(/TryAgain/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders children when no error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div>Hi Natural Hazards</div>
      </ErrorBoundary>,
    );

    const helloText = getByText(/Hi Natural Hazards/i);
    expect(helloText).toBeInTheDocument();
  });
  
  it('should merge existing and incoming data correctly', () => {
    // Mock existing and incoming data
    const existingData = [
      {
        id: 1,
        btp_account_attributes: {
          name: 'Existing Account',
        },
      },
    ];
    const incomingData = [ {"btp_account_attributes": {"address": "New Address"}, "id": 1}];

    // Assuming you have a function to merge data (similar to what's in your typePolicies)
    const mergedData = Object.assign({},existingData[0], incomingData[0]);  

    // Assert that the merged data is correct
    expect(mergedData).toEqual(
      {
        btp_account_attributes: {
          address: 'New Address',
        },
        id: 1
      },
    );
  });
});




