import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BigNumber} from 'bignumber.js';


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
		"outputs": [
			{
				"name": "pOutcome",
				"type": "string"
			},
			{
				"name": "pState",
				"type": "string"
			},
			{
				"name": "yesVotes",
				"type": "uint256"
			},
			{
				"name": "noVotes",
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
				"name": "pId",
				"type": "uint256"
			}
		],
		"name": "getProposalDetails",
		"outputs": [
			{
				"name": "pName",
				"type": "string"
			},
			{
				"name": "pDes",
				"type": "string"
			}
		],
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
		"inputs": [],
		"name": "getSecretMsg",
		"outputs": [
			{
				"name": "",
				"type": "string"
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
				"name": "newMsg",
				"type": "string"
			}
		],
		"name": "setMsg",
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
		"name": "secretMsg",
		"outputs": [
			{
				"name": "",
				"type": "string"
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
      ContractInstance: MyContract.at ('0x8ca0abd508228fda92191ef8cb4462efb734f5c7'),
      /* Phase 3 -- Smart Contract Manipulation */
      contractState: '',
      numVotes: '',
      userId:'',
      proposalId:'',
      shares: '',
      proposalName: '',
      proposalDescription:'',
      proposalQuorum:'',
      proposalTTL:'',
      outcome:'',
      state:'',
      yesVote:'',
      noVote:'',
      currentPname:'',
      currentPdes:''
    }

    /* Phase 2 */
    this.querySecret = this.querySecret.bind (this);

    /* Phase 3 */
    this.handleContractStringSubmit = this.handleContractStringSubmit.bind (this);
    this.handleRegisterVoter = this.handleRegisterVoter.bind(this);
    this.handleCreateProposal = this.handleCreateProposal.bind(this);
    this.handleCalculateTotalVote = this.handleCalculateTotalVote.bind(this);
    this.handleCheckExpiry = this.handleCheckExpiry.bind(this);
    this.handleCastVote = this.handleCastVote.bind(this);
    this.handleGetOutCome = this.handleGetOutCome.bind(this);
    //not working
    this.getProposalDetails = this.getProposalDetails.bind(this);

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
const { proposalName: pName, proposalDescription: pDes, proposalQuorum: pQuorum, proposalTTL: pTTL} = this.state;

  createNewProposal (
      pName,pDes,pQuorum,pTTL, {
      gas: 300000,
      from: window.web3.eth.accounts[0],
      value: window.web3.toWei(0.02,'ether')
    }, (err,result) => {
      console.log('Creating new proposal!');
      //console.log(result);
    }
  )
}

handleCalculateTotalVote (event) {
  event.preventDefault();
  const { calculateTotalVotes } = this.state.ContractInstance;
  const { proposalId: pId } = this.state;

    calculateTotalVotes (
      pId, (err,result) => {
        console.log('Calculating total votes that registered to proposal!');
        //console.log(result);
      }
    )
}

handleCastVote (event) {
  event.preventDefault();
  const { castVoteForProposal } = this.state.ContractInstance;
  const { numVotes: numVotes, userId: uId, proposalId: pid } = this.state;
    castVoteForProposal(
      numVotes,uId,pid,
        (err,result) => {
      console.log('Casting votes for proposal!');
      //console.log(result);
    }
    )
}

handleCheckExpiry (event) {
  event.preventDefault();
  const { checkExpiry } = this.state.ContractInstance;
  const { proposalId: pId } = this.state;

    checkExpiry.call(
      pId, (err,result) => {
        console.log('Checking expiry for proposal!');
        //console.log(result);
        if(result) {
            alert("Expired Proposal!");
        } else {
            alert("Not expired yet.");
        }
      }
    )
}

handleGetOutCome (event) {
  event.preventDefault();
  const { getOutcome } = this.state.ContractInstance;
  const { proposalId:pId } = this.state;
  getOutcome.call(
    pId, (err,result) => {
      console.log('Checking expiry for proposal!');
      console.log(result);
      
      if(result) {
          
          var yes = new BigNumber(result[2]).toNumber();
          var no = new BigNumber(result[3]).toNumber();
          //alert(yes);
          
          this.setState({outcome:result[0], state:result[1],yesVote:yes,noVote:no})
      
      } else 
      {
          alert("Proposal may have expired. Check expiry first.");
      }
      
    }
  )
}

// not working
 getProposalDetails(event){
  event.preventDefault();
  const { getProposalDetails } = this.state.ContractInstance;
  const { proposalId:pId } = this.state;
  getProposalDetails.call (
    pId,
     (err,result) => {
      console.log('Getting Proposals');
      console.log(result);
      this.setState({currentPname:result[0], currentPdes:result[1]})
    }
  )

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
        <form onSubmit={ this.getProposalDetails }>
          <input
            type="number"
            name="string-change"
            placeholder="Enter proposal id..."
            value ={ this.state.proposalId }
            onChange={ event => this.setState ({ proposalId: event.target.value }) } />
          <button type="submit"> Query Proposal </button>
          <br/>
          <p>Proposal Name: {this.state.currentPname} </p>
          <p>Proposal Description: {this.state.currentPdes} </p>
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
              onChange = { event => this.setState ({proposalName: event.target.value})}
               />
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

            <br/>
            <form onSubmit={ this.handleCalculateTotalVote }>
            <input
            type="number"
            name="calculate votes registered to proposal"
            placeholder="Enter proposal id..."
            value ={ this.state.proposalId }
            onChange={ event => this.setState ({ proposalId: event.target.value }) } />
            <br/>
          <button type="submit"> Calculate votes registered to propose </button>
          </form>

          <br/>
          <form onSubmit={ this.handleCastVote }>
          <input
          type="number"
          name="Cast-votes"
          placeholder="Enter votes to cast..."
          value ={ this.state.numVotes }
          onChange={ event => this.setState ({ numVotes: event.target.value }) } />
          <br/>
          <input
          type="number"
          name="Cast-votes-pId"
          placeholder="Enter proposal id to cast votes..."
          value ={ this.state.proposalId }
          onChange={ event => this.setState ({ proposalId: event.target.value }) } />
          <br/>
          <input
          type="number"
          name="Cast-votes-uId"
          placeholder="Enter user id to cast..."
          value ={ this.state.userId }
          onChange={ event => this.setState ({ userId: event.target.value }) } />
          <br/>
          <button type="submit"> Cast Vote for proposal </button>
          </form>

          <br/>
          <p>Please check expiry for proposal before getting outcome!! </p>
          <form onSubmit={ this.handleCheckExpiry }>
          <input
          type="number"
          name="Checking expiry date"
          placeholder="Enter proposal id..."
          value ={ this.state.proposalId }
          onChange={ event => this.setState ({ proposalId: event.target.value }) } />
          <br/>
          <button id='expiry' type="submit"> Check Expiry </button>
          </form>
          <br/>

          <form onSubmit={ this.handleGetOutCome }>
          <input
          type="number"
          name="Get Outcome for proposal"
          placeholder="Enter proposal id..."
          value ={ this.state.proposalId }
          onChange={ event => this.setState ({ proposalId: event.target.value }) } />
          <br/>
          <button type="submit">Get Outcome for proposal </button>
          </form>
          <br/>
          <p>Outcome is: {this.state.outcome} </p>
          <p>State is: {this.state.state} </p>
      {/*    <p>Yes Votes is: {this.state.yesVote} </p>
          <p>No Votes: {this.state.noVote} </p> */}
      </div>
    );
  }
}

export default App;
