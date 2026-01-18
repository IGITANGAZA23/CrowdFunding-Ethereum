import React, { Component } from 'react'
import { Table, Button, Message, Icon, Popup } from 'semantic-ui-react';
import { ethers } from 'ethers';
import provider from '../Ethereum/web3';
import Campaign from '../Ethereum/campaign';

export default class RequestRow extends Component {

    state = {
        errorMessageApprove: '',
        loadingApprove: false,
        errorMessageFinalize: '',
        loadingFinalize: false,
    };

    onApprove = async () => {

        this.setState({
            loadingApprove: true,
            errorMessageApprove: ''
        });

        try {
            const campaign = Campaign(this.props.address);

            const signer = await provider.getSigner();
            const campaignWithSigner = campaign.connect(signer);

            const tx = await campaignWithSigner.approveRequest(this.props.id);
            await tx.wait();
        }
        catch (error) {
            this.setState({
                errorMessageApprove: error.message
            });
        } finally {
            this.setState({
                loadingApprove: false,
            });
        }
    };

    onFinalize = async () => {
        this.setState({
            loadingFinalize: true,
            errorMessageFinalize: ''
        });
        try {
            const campaign = Campaign(this.props.address);

            const signer = await provider.getSigner();
            const campaignWithSigner = campaign.connect(signer);

            const tx = await campaignWithSigner.finalizeRequest(this.props.id);
            await tx.wait();
        } catch (error) {
            this.setState({
                errorMessageFinalize: error.message
            });
        } finally {
            this.setState({
                loadingFinalize: false,
            });
        }
    };

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete} >
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{ethers.formatEther(request.value)} (ether)</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell error={!!this.state.errorMessageApprove}>
                    <Popup
                        header="Error"
                        content={this.state.errorMessageApprove}
                        trigger={<Icon name='attention'
                            style={{ display: this.state.errorMessageApprove ? 'inline-block' : 'none' }} />}
                        hoverable />
                    {request.complete ? null : (<Button color='green' loading={this.state.loadingApprove} basic onClick={this.onApprove}>Approve</Button>)}
                </Cell>
                <Cell error={!!this.state.errorMessageFinalize}>
                    <Popup
                        header="Error"
                        content={this.state.errorMessageFinalize}
                        trigger={<Icon name='attention'
                            style={{ display: this.state.errorMessageFinalize ? 'inline-block' : 'none' }} />}
                        hoverable />
                    {request.complete ? null : (<Button color='teal' loading={this.state.loadingFinalize} basic onClick={this.onFinalize}>Finalize</Button>)}
                </Cell>
            </Row>
        );
    }
}
