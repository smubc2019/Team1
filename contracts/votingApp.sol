pragma solidity ^0.5.0;

/// #sol : Voting.sol
/// SMUBC2019 : SMU Certified Blockchain Developer 2019
/// Smart contract project : Voting System
/// By Team 1: Darryl, Po Jid, Yong Xian
/// All Rights Reserved, 27 May 2019
//Date are stored in the Unix epoch format (timestamp) 
//which consists in an integer of the number of seconds since 1970-01-01.
/*
1) Able to Register Voters (Those that are voting for the proposal)
2) Create a new proposals
3) Calculate outcome of proposal base on 2 decimal points
4) Calculate Expiry data based on TTL NOTE: Maybe do not need usedByDate since proposal expired based on TTL
1 hour = 36000 seconds
*/
    
contract Voting {


    enum State {
        READY,      // beginVoting() called, Ready to accept votes
        ABORTED,    // abort() called, Voting aborted
        WAIT,       // newProposal() called, Prepare for voting
        COMPLETED,  // Voting is completed
        EXPIRED     // pre-set voting period have reached
    } 
    
    enum Outcome {
        PENDING,       // no outcome yet
        PASSED,     // we reached decision, proposal accepted and passed
        DEFEATED    // we reached decision, proposal is rejected / defeated
    }

    // Table of all registered voters, voter must call registerMe()
    struct voter {
        address voterAddress;  // voter address
        uint256  shares;  // number of share a voter has, 1 share = 1 vote
        bool voted;     // true if already voted
    }
    uint256 public numVoters = 0;
    mapping(uint256 => voter) public voters;
   
   //test methods
   
   uint256 public secret = 50;
    function getSecret () public  returns (uint256) {
    return secret;
  }
  
   function setValue (uint256 newInt) public payable {
    secret = newInt;
  }
  
    string public secretMsg = "You fetch me!";
    function getSecretMsg () public  returns (string memory) {
    return secretMsg;
  }
  
   function setMsg (string memory newMsg) public payable {
    secretMsg = newMsg;
  }
    
    struct proposal {
        uint256 totalVotes;             // total available votes (shares) = sum(shares) of all voters
        uint256 quorum;                 // minimum quorum (in %) of YES votes needed to pass resolution
        uint256 yesVotes;               // Total number of YES votes
        uint256 noVotes;                // Total number of NO votes
        State state;                // Current state of voting
        Outcome  outcome;           // Final resulution : PASSED or DEFEATED
        string name;                // Nme of Proposal
        string description;         // Brief description of this proposal
        address owner;
        uint256 TTL;                  // Time-to-live in days, set in newProposal()
        uint256 usedByDate;            // value set in beginVoting(), voting ceases beyond this date
    }
     uint256 public proposalId = 0;
     mapping(uint256 => proposal) public proposals;

    
    //register Voters. Must be done before creation of proposals
    function registerVoters(uint8 shares) public payable{
        require(shares >0);
        require(msg.value > 0.01 ether, "at least 0.01 ETH is needed to registered a voter");
        
        // new voter object
        voter memory newVoter =voter (
            msg.sender,
            shares,
            false
        );
        uint256 newVoterId = numVoters++;
        voters[newVoterId] = newVoter;
    }
    
    // setup new voting : Administrator create new voting call
    // Setup proposal, ready for voting
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function createNewProposal(
            string memory name,         // Proposal name, like "HELIPAD"
            string memory  description,  // , like "Proposal to build helicopter land pad"
            uint8   quorum,             // minimum supporting vote to pass resolution
            //uint8   totalVotes,         // sum of legal votes of all voters, like 100 people total 160 votes as some voters has more votes
            uint256  TTL                 // Time to live in days, from beginVoting()
            //uint256 usedByDate
    ) public payable returns(string memory) {
        ///values must be set when beginVoting() is called
        require(msg.value > 0.01 ether, "at least 0.01 ETH is needed to create a new propsoal");
        //new proposal object
        proposal memory newProposal = proposal (
        0,          // total available votes (shares) = sum(shares) of all voters
        quorum,                 // minimum quorum (in %) of YES votes needed to pass resolution
        0,              // Total number of YES votes
        0,              // Total number of NO votes
        State.WAIT,             // Current state of voting
        Outcome.PENDING,            // Final resulution : PASSED or DEFEATED
        name,                // Nme of Proposal
        description,         // Brief description of this proposal
        msg.sender,
        TTL,                  // Time-to-live in days, set in newProposal()
        block.timestamp+TTL
       );
        uint256 newProposalId = proposalId++;
        proposals[newProposalId] = newProposal;
        
        return name;
    }
    //Calculate total votes holds by all the voters
    function calculateTotalVotes(uint256 pId) public  {
        uint totalvotes=0;
        proposals[pId].state = State.READY;
        for (uint8 i = 0 ; i< numVoters; i++){
            
            totalvotes+=voters[i].shares;
        }
        proposals[pId].totalVotes= totalvotes;
    }
    
    uint256 public uncastedVotes=0;
    //Cast vote based on id of user starting from 0. Each id tag to a voter address
    function castVoteForProposal(uint8 vote,uint256 userId ,uint256 pId)public{
        //require(vote > 0 ,"vote cannot be equal to 0 or less!");
      require(checkExpiry(pId)!= true,"Proposal Expired cannot vote!");
      require(proposals[pId].state != State.ABORTED, "Proposal has been aborted cannot vote!");
      require(voters[userId].voted!=true, "user voted already!" );
      require(voters[userId].shares>= vote && vote<= voters[userId].shares,"user casted votes more than what he owns!");
      if(!voters[userId].voted){ 
        voters[userId].voted = true;
        if(vote > 0){
            proposals[pId].yesVotes+=vote;
        }
        }
    }
    
    //Edited here
    //CALCULATE THE OUTCOME OF THE VOTING
    function getOutcome(uint256 pId) public returns (string memory pOutcome, string memory pState, uint256 yesVotes, uint256 noVotes ){
        string memory outcome;
        string memory state;
        require(checkExpiry(pId)!=true,"Proposal Expired cannot get outcome!");
        require(proposals[pId].state != State.ABORTED, "Proposal has been aborted cannot vote!");
        uint256 quorum = (100 / proposals[pId].quorum) *100;// if 80% = 125 (1.25)
        //qurom is in percentage
        uint256 totalVotes = proposals[pId].totalVotes;
        uint256 requiredVotes = (totalVotes / quorum)* 100; //if total votes is 16, 80% is 12.8
        uint castedVotes = proposals[pId].yesVotes * 100;
        
        //calculate uncasted votes
        proposals[pId].noVotes = proposals[pId].totalVotes - proposals[pId].yesVotes;
        
        if(castedVotes > requiredVotes){
            proposals[pId].outcome= Outcome.PASSED;
            outcome = "PASSED";
        }else{
            proposals[pId].outcome = Outcome.DEFEATED;
            outcome = "DEFEATED";
        }
          proposals[pId].state= State.COMPLETED;
          state = "COMPLETED";
          return (outcome,state,proposals[pId].yesVotes,proposals[pId].noVotes );
    }
    
    function getProposalDetails(uint256 pId) public returns (string memory pName, string memory pDes, uint256 pTotlalVotes, string memory pState) {
        string memory name = proposals[pId].name;
        string memory des = proposals[pId].description;
        string memory state;
        uint256 totalVotes = proposals[pId].totalVotes;
        if(proposals[pId].state == State.WAIT){
            state = "WAIT";
        }else  if(proposals[pId].state == State.COMPLETED){
            state = "COMPLETED";
        }else  if(proposals[pId].state == State.ABORTED){
            state = "ABORTED";
        }else  if(proposals[pId].state == State.READY){
            state = "READY";
        }else  if(proposals[pId].state == State.EXPIRED){
            state = "EXPIRED";
        }
        return (name, des, totalVotes,state);
        
    }
    
    // Check used-by-date, set voting state accordingly
    function checkExpiry(uint256 pId) public returns (bool) {
        bool expired = false;
        if (now > proposals[pId].usedByDate){
            expired = true;
            proposals[pId].state=State.EXPIRED;
            //VotingIsOver();
        }
        return expired;
    }
    
    
    // abort voting : Administrator call  abort, or perhaps we reached used-by-date and nobody ever voted
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function abort(uint256 pId) public {
        require(proposals[pId].state != State.COMPLETED, "Cannot abort completed voting"); // can't abort completed voting
        proposals[pId].state=State.ABORTED;
        proposals[pId].outcome=Outcome.PENDING;
    }
    
    //method to get variables from   proposal 
    
    }



