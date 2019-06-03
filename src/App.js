import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


/* Phase 2 -- Setting Up and Interacting with React */
class App extends Component {
  constructor (props) {
    super (props);

    /* Phase 2 */
    /* Edit this with each iteration of Smart Contract */
    /* Note: this ABI is a placeholder and will not work */
    const MyContract = window.web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "pId",
				"type": "uint256"
			}
		],
		"name": "abort",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "pId",
				"type": "uint256"
			}
		],
		"name": "calculateTotalVotes",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "vote",
				"type": "uint8"
			},
			{
				"name": "userId",
				"type": "uint256"
			},
			{
				"name": "pId",
				"type": "uint256"
			}
		],
		"name": "castVoteForProposal",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "pId",
				"type": "uint256"
			}
		],
		"name": "checkExpiry",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			},
			{
				"name": "quorum",
				"type": "uint8"
			},
			{
				"name": "TTL",
				"type": "uint256"
			}
		],
		"name": "createNewProposal",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "pId",
				"type": "uint256"
			}
		],
		"name": "getOutcome",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "getSecret",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "shares",
				"type": "uint8"
			}
		],
		"name": "registerVoters",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newInt",
				"type": "uint256"
			}
		],
		"name": "setValue",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numVoters",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "proposalId",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposals",
		"outputs": [
			{
				"name": "totalVotes",
				"type": "uint256"
			},
			{
				"name": "quorum",
				"type": "uint256"
			},
			{
				"name": "yesVotes",
				"type": "uint256"
			},
			{
				"name": "noVotes",
				"type": "uint256"
			},
			{
				"name": "state",
				"type": "uint8"
			},
			{
				"name": "outcome",
				"type": "uint8"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			},
			{
				"name": "owner",
				"type": "address"
			},
			{
				"name": "TTL",
				"type": "uint256"
			},
			{
				"name": "usedByDate",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "secret",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "uncastedVotes",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"name": "voterAddress",
				"type": "address"
			},
			{
				"name": "shares",
				"type": "uint256"
			},
			{
				"name": "voted",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
])
    this.state = {
      /* Phase 2 */
      /* Edit this with each iteration of Smart Contract */
      /* Note: this adress is a placeholder and will not work */
      ContractInstance: MyContract.at ('0xcfd171907b4199528a7bac34a7d66970786e87f9'),
      /* Phase 3 -- Smart Contract Manipulation */
      contractState: '',
      shares: '',
      propsalName: '',
      propsalDescription:'',
      propsalQuorum:'',
      propsalTTL:''
    }

    /* Phase 2 */
    this.querySecret = this.querySecret.bind (this);

    /* Phase 3 */
    this.handleContractStringSubmit = this.handleContractStringSubmit.bind (this);
    this.handleRegisterVoter = this.handleRegisterVoter.bind(this);
    this.getProposal = this.getProposal.bind(this);

    this.handleCreateProposal = this.handleCreateProposal.bind(this);
  }

  /* Phase 2 */
  querySecret () {
    const { getSecret } = this.state.ContractInstance;

    getSecret ((err, secret) => {
      if (err) console.error ('An error occured::::', err);
      console.log ('This is our contract\'s secret::::', secret);
      this.setState({contractState: secret})
    })
  }

  /* Phase 3 */
  handleContractStringSubmit (event) {
    event.preventDefault ();

    const { setValue } = this.state.ContractInstance;
    const { contractState: newState } = this.state;

    setValue (
      newState,
      {
        gas: 300000,
        from: window.web3.eth.accounts[0],
        value: window.web3.toWei (0.01, 'ether')
      }, (err, result) => {
        console.log ('Smart contract string is changing.');
      }
    )
  }

//functions
//register voters
handleRegisterVoter (event) {
  event.preventDefault();
  const { registerVoters } = this.state.ContractInstance;

  const { shares: newShares } = this.state;
  registerVoters (
    newShares, {
      gas: 300000,
      from: window.web3.eth.accounts[0],
      value: window.web3.toWei(0.02,'ether')
    }, (err,result) => {
      console.log('Registering voters!');
      //console.log(result);
    }
  )

}

handleCreateProposal (event) {
  event.preventDefault();
const { createNewProposal } = this.state.ContractInstance;
  const { propsalName: pName, propsalDescription: pdes, propsalQuorum: pQuorum, propsalTTL:pTTL} = this.state;

  createNewProposal (
    (pName, pdes, pQuorum, pTTL), {
      gas: 300000,
      from: window.web3.eth.accounts[0],
      value: window.web3.toWei(0.02,'ether')
    }, (err,result) => {
      console.log('Creating new proposal!');
      //console.log(result);
    }

  )

}


async getProposal(){
  const { proposals } = this.state.ContractInstance;
  proposals (
    0, {
      gas: 300000,
      from: window.web3.eth.accounts[0],
      value: window.web3.toWei(0.01,'ether')
    }, (err,result) => {
      console.log('Getting Proposals');
    }
  )

  const pro = await proposals;
  console.log(pro);
}





  render () {


    return (
      <div className='App'>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"> React & Ethereum Simple Application </h1>
          <p>Your account: {window.web3.eth.accounts[0]} </p>
        </header>

        {/* Phase 2 */}
        <br />
        <br />
        <button onClick={ this.querySecret }> Query Smart Contract's Secret </button>
        <p>Secret: { this.state.contractState } </p>
        <br />
        <br />
        {/*phase 3*/}
        <br />
        <form onSubmit={ this.handleContractStringSubmit }>
          <input
            type="text"
            name="string-change"
            placeholder="Enter new string..."
            value ={ this.state.contractState }
            onChange={ event => this.setState ({ contractState: event.target.value }) } />
          <button type="submit"> Submit </button>
          <br/>

        <button onClick=  { this.getProposal }> Query Contract's Proposal</button>
        </form>

        {/* register voter */}

        <br />
        <form onSubmit={ this.handleRegisterVoter }>
          <input
            type="number"
            name="register-voter"
            placeholder="Enter voter shares..."
            value ={ this.state.shares }
            onChange={ event => this.setState ({ shares: event.target.value }) } />

          <button type="submit"> Register Voter </button>

          </form>
          <br/>
          <form onSubmit={ this.handleCreateProposal }>
            <input
              type="text"
              name="proposal-name"
              placeholder="Enter proposal name..."
              value ={ this.state.proposalName }
              onChange={ event => this.setState ({ proposalName: event.target.value }) } />
              <br/>
              <input
              type="text"
              name="proposal-description"
              placeholder="Enter proposal description..."
              value ={ this.state.proposalDescription }
              onChange={ event => this.setState ({ proposalDescription: event.target.value }) } />
              <br/>
              <input
              type="number"
              name="proposal-quorum"
              placeholder="Enter proposal quroum..."
              value ={ this.state.proposalQuorum }
              onChange={ event => this.setState ({ proposalQuorum: event.target.value }) } />
              <br/>
              <input
              type="number"
              name="proposal-ttl"
              placeholder="Enter proposal ttl..."
              value ={ this.state.proposalTTL }
              onChange={ event => this.setState ({ proposalTTL: event.target.value }) } />
              <br/>
            <button type="submit"> Create new Proposal </button>

            </form>

      </div>
    );
  }
}

export default App;
