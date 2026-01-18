import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../Ethereum/campaign';
import provider from '../Ethereum/web3';
import { ethers } from 'ethers';
import { Router } from '../routes';


export default class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);

        this.setState({
            loading: true,
            errorMessage: ''
        });

        try {
            const signer = await provider.getSigner();
            const campaignWithSigner = campaign.connect(signer);

            const tx = await campaignWithSigner.contribute({
                value: ethers.parseEther(this.state.value)
            });
            await tx.wait();

            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (error) {
            this.setState({
                errorMessage: error.message
            });
        }

        this.setState({
            loading: false,
            value: ''
        });
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        value={this.state.value}
                        label="ether"
                        labelPosition="right"
                        onChange={event => this.setState({
                            value: event.target.value
                        })}
                    />
                </Form.Field>

                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button primary loading={this.state.loading}>
                    Contribute!
                </Button>
            </Form>
        );
    }
}