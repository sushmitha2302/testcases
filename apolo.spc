it('should handle Apollo client cache error in clearACESCache', async () => {
    const apolloClient = require('@apollo/client').useApolloClient();
    apolloClient.clearStore.mockRejectedValueOnce(new Error('Cache clear failed'));
    
    const { getByTestId } = render(<ACEModal includeProspect={false} setIncludeProspect={setIncludeProspect} setIsAceModalOpen={setIsAceModalOpen} />);
    const runButton = getByTestId('ace-run');
    
    await waitFor(() => {
      userEvent.click(runButton);
    });
    
    expect(apolloClient.clearStore).toHaveBeenCalled();
  });

  it('should handle state updates correctly in handleRunClick', async () => {
    const { getByTestId } = render(<ACEModal includeProspect={false} setIncludeProspect={setIncludeProspect} setIsAceModalOpen={setIsAceModalOpen} />);
    const runButton = getByTestId('ace-run');
    
    await waitFor(() => {
      userEvent.click(runButton);
    });
    
    // Wait for setTimeout to complete
    await waitFor(() => {
      expect(setIncludeProspect).toHaveBeenCalledWith(expect.any(Boolean));
      expect(setIsAceModalOpen).toHaveBeenCalledWith(false);
    });
  });

  it('should render the loading state with spinner and text', async () => {
    const { container, getByTestId } = render(<ACEModal includeProspect={false} setIncludeProspect={setIncludeProspect} setIsAceModalOpen={setIsAceModalOpen} />);
    const runButton = getByTestId('ace-run');
    
    await waitFor(() => {
      userEvent.click(runButton);
    });
    
    await waitFor(() => {
      expect(container.querySelector('rds-spinner')).toBeInTheDocument();
      expect(screen.getByText('Gathering Data...')).toBeInTheDocument();
    });
  });

  it('should close the modal when onRdsModalClosed is triggered', async () => {
    const { getByTestId } = render(<ACEModal includeProspect={false} setIncludeProspect={setIncludeProspect} setIsAceModalOpen={setIsAceModalOpen} />);
    
    const modal = getByTestId('ace-modal');
    
    await waitFor(() => {
      userEvent.click(modal); // Simulating closing of modal
      expect(setIsAceModalOpen).toHaveBeenCalledWith(false);
    });
  });

});
