/// Voting.sol
/// SMUBC2019 : SMU Certified Blockchain Developer 2019
/// Smart contract project : Voting System
/// By Team 1: Darryl, Po Jid, Yong Xian
/// All Rights Reserved, 27 May 2019

// Date are stored in the Unix epoch format (timestamp)
// which consists in an integer of the number of seconds since 1970-01-01.

/*
   1) Able to Register Voters (Those that are voting to support the proposal, those who against shall NOT vote)
   2) Create a new proposals
   3) Calculate outcome of proposal base on 2 decimal points
   4) Calculate Expiry data based on TTL in minutes NOTE: 1 minute=600, 1 hour = 36000
*/

pragma solidity ^0.5.0;


contract Voting {

	enum State {
		READY,		// beginVoting() called, Ready to accept votes
		ABORTED,	// abort() called, Voting aborted
		WAIT,		// newProposal() called, Prepare for voting
		COMPLETED,	// Voting is completed
		EXPIRED		// pre-set voting period have reached
	}

	enum Outcome {
		PENDING,	// no outcome yet
		PASSED,		// we reached decision, proposal accepted and passed
		DEFEATED	// we reached decision, proposal is rejected / defeated
	}

	// Table of all registered voters, voter must call registerMe()
	struct voter {
		address voterAddress;	// voter address
		uint256  shares;	// number of share a voter has, 1 share = 1 vote
		bool voted;		// true if already voted
	}

	uint256 public numVoters = 0;
	mapping(uint256 => voter) public voters;



	struct proposal {
		uint256 totalVotes;	// total available votes (shares) = sum(shares) of all voters
		uint256 quorum;		// minimum quorum (in %) of YES votes needed to pass resolution
		uint256 yesVotes;	// Total number of YES votes
		uint256 noVotes;	// Total number of NO votes
		State state;		// Current state of voting
		Outcome  outcome;	// Final resulution : PASSED or DEFEATED
		string name;		// Nme of Proposal
		string description;	// Brief description of this proposal
		address owner;
		uint256 TTL;		// Time-to-live in minutes, set in newProposal()
		uint256 usedByDate;	// in minutes
	}
     
	uint256 public proposalId = 0;
	mapping(uint256 => proposal) public proposals;


	//register Voters. Must be done before creation of proposals
	function registerVoters(uint8 shares) public payable returns (address){
		require(shares >0);
		require(msg.value > 0.01 ether, "at least 0.01 ETH is needed to registered a voter");

		// new voter object
		voter memory newVoter = voter (
			msg.sender,	// voter's address
			shares,		// voter's shares holding
			false		// = have not voted
		);

		uint256 newVoterId = numVoters++;
		voters[newVoterId] = newVoter;
		return msg.sender;
	}

	// setup new voting : Administrator create new voting call
	// Setup proposal, ready for voting
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	function createNewProposal(
		string memory name,		// Proposal name, like "HELIPAD"
		string memory  description,	// like "Proposal to build helicopter land pad"
		uint8   quorum,			// minimum % supporting vote to pass resolution
		uint256  TTL			// Time to live in minutes from creation
	) public payable returns(string memory) {
        
		///values must be set when beginVoting() is called
		require(msg.value > 0.01 ether, "at least 0.01 ETH is needed to create a new propsoal");

		//new proposal object
		proposal memory newProposal = proposal (
			0,		// total available votes (shares) = sum(shares) of all voters
			quorum,		// minimum quorum (in %) of YES votes needed to pass resolution
			0,		// Total number of YES votes
			0,		// Total number of NO votes
			State.WAIT,	// Current state of voting
			Outcome.PENDING,// Final resulution : PASSED or DEFEATED
			name,		// Nme of Proposal
			description,	// Brief description of this proposal
			msg.sender,	// voting admin's address
			TTL*600,	// Time-to-live in minutes
			block.timestamp+TTL*600	// Proposal voting validity (usedbydate) in future timestamp unit
		);
		
		uint256 newProposalId = proposalId++;
		proposals[newProposalId] = newProposal;

		return name;
	}

	//Calculate total votes holds by all the voters
	function calculateTotalVotes(uint256 pId) public  {
		uint totalvotes=0;
		for (uint8 i = 0 ; i< numVoters; i++){
			totalvotes+=voters[i].shares;
		}
		proposals[pId].totalVotes= totalvotes;
	}

	uint256 public uncastedVotes=0;

	//Cast vote based on id of user starting from 0. Each id tag to a voter address
	function castVoteForProposal(uint8 vote,uint256 userId ,uint256 pId)public{
		require(unExpired(pId), "Proposal Expired cannot vote!");
		require(!voters[userId].voted, "user voted already!" );
		require(vote >0 && voters[userId].shares<= vote, "user casted votes more than what he owns!");

		if(!voters[userId].voted){
			voters[userId].voted = true;
			proposals[pId].yesVotes+=vote;
		}
	}


	//calculate and returns the OUTCOME of the voting
	function getOutcome(uint256 pId) public {
		//qurom is in percentage
		uint256 quorum = (100 / proposals[pId].quorum) *100;// if 80% = 125 (1.25)
		
		uint256 totalVotes = proposals[pId].totalVotes;
		uint256 requiredVotes = (totalVotes / quorum)* 100; //if total votes is 16, 80% is 12.8
		uint castedVotes = proposals[pId].yesVotes * 100;

		//calculate uncasted votes
		proposals[pId].noVotes = proposals[pId].totalVotes - proposals[pId].yesVotes;

		if(castedVotes > requiredVotes){
			proposals[pId].outcome= Outcome.PASSED;

		} 
		else {
			proposals[pId].outcome = Outcome.DEFEATED;
		}
		
		proposals[pId].state= State.COMPLETED;
	}

	// Check used-by-date, set voting state accordingly, return false if expired
	function unExpired(uint256 pId) public returns (bool) {
		bool unexpired = true;
		
		if (now > proposals[pId].usedByDate){
			unexpired = false;
			proposals[pId].state=State.EXPIRED;
		}

		return unexpired;
	}


	// abort voting : Administrator call  abort, or perhaps we reached used-by-date and nobody ever voted
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	function abort(uint256 pId) public {
		require(proposals[pId].state != State.COMPLETED, "Cannot abort completed voting"); // can't abort completed voting
		proposals[pId].state=State.ABORTED;
		proposals[pId].outcome=Outcome.PENDING;
	}

    }
