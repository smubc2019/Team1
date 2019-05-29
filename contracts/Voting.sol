/// #sol : Voting.sol
/// SMUBC2019 : SMU Certified Blockchain Developer 2019
/// Smart contract project : Voting System
/// By Team 1: Darryl, Po Jid, Yong Xian
/// All Rights Reserved, 27 May 2019

pragma solidity ^0.5.1;



    
contract Voting {


    enum State {
        READY,      // beginVoting() called, Ready to accept votes
        ABORTED,    // abort() called, Voting aborted
        WAIT,       // newProposal() called, Prepare for voting
        COMPLETED,  // Voting is completed
        EXPIRED     // pre-set voting period have reached
    } 
    
    enum Outcome {
        NONE,       // no outcome yet
        PASSED,     // we reached decision, proposal accepted and passed
        DEFEATED    // we reached decision, proposal is rejected / defeated
    }

    struct Proposal {
        uint256 totalVotes; 	        // total available votes (shares) = sum(shares) of all voters
        uint256 quorum;  	            // minimum quorum (in %) of YES votes needed to pass resolution
        uint256 yesVotes;		        // Total number of YES votes
        uint256 noVotes;		        // Total number of NO votes
        State state;	            // Current state of voting
        Outcome  outcome;	        // Final resulution : PASSED or DEFEATED
        string name;                // Nme of Proposal
        string description;         // Brief description of this proposal
        uint256  registeredVoters;    // Total number of voters registered to vote
        address owner;
        uint256 TTL;                  // Time-to-live in days, set in newProposal()
        uint256 usedByDate;            // value set in beginVoting(), voting ceases beyond this date
    }

    struct Voter {
        address voter;  // voter address
        uint256  shares;  // number of share a voter has, 1 share = 1 vote
        bool voted;     // true if already voted
    }


    
    /// We only have a single Proposal struct to store proposal info
    /// values must be set when beginVoting() is called
    Proposal proposalToVote  = Proposal  (
        0,              // total available votes if all voter voted
        0,  	        // minimum quorum (in %) of YES votes needed to pass resolution
        0,	            // Total number of YES votes
        0,	            // Total number of NO votes
        State.WAIT,	    // Current state of voting
        Outcome.NONE,	// outcome : PASSED or DEFEATED
        "-",            // Name of proposal
        "-",            // Brief description of proposal
        0,              // total voters have registered
        msg.sender,     // owner=msg.sender, should be administrator's address
        999,            // TTL, set high to avoid expiry in start
        now+999        // Ued-by-date, set high so we don't start in expired mode
    );

    // Table of all registered voters, voter must call registerMe()
    Voter[] votersRegister;

    // Check used-by-date, set voting state accordingly
    function checkExpiry() internal {
        if (now > proposalToVote.usedByDate){
            proposalToVote.state=State.EXPIRED;
            VotingIsOver();
        }
    }
    
    // Given voter's address, return number of votes (share) he/she has
    function getShares(address voter) internal returns(uint256) {
        uint256 k=0;

        while (k<proposalToVote.registeredVoters){
            if (!votersRegister[k].voted && votersRegister[k].voter==voter) {
                return votersRegister[k].shares;
            }
            k++;
        }
        
        return 0;
    } 
    
    
    // return result of voting in a string
    function GetOutcome() internal returns(bytes32) {
        require(proposalToVote.state==State.COMPLETED, "Outcome meaningless");
        
        bytes32 result="";
        
        if (proposalToVote.outcome==Outcome.PASSED){
                result="Proposal ACCEPTED";
        }
        else if (proposalToVote.outcome==Outcome.DEFEATED){
                result="Proposal REJECTED";
        }
        else {
            result="UNKNOWN";
        }
        
        return result;
    }
    
    
    // Process vote, update register, Return false if voter voted before
    function acceptVote(address voter) private returns(bool) {
        uint256 k=0;
        bool voted=false;
        bool allow=false;

        // check used-by-date first
        checkExpiry();
        
        // We must be in READY state to accept vote, else fail
        require(proposalToVote.state==State.READY, "Voting is no longer allowed");
        
        
        // Check if voter have voted before
        while (k<proposalToVote.registeredVoters){
            if (votersRegister[k].voter==voter) {
                if (votersRegister[k].voted){
                    // voter found, but had voted before
                    voted=true;
                    allow=false;
                }
                else {
                    // voter found, but never voted, so record this vote
                    votersRegister[k].voted=true;
                    voted=false; 
                    allow=true;
                }
                break;
            }
            k++;
        }
        
        
        if (! voted ){
            if (k>=proposalToVote.registeredVoters){
                // No vote record found, but voter not registered
                allow=false;
            }
        }
        
        return allow;
    } 
    
    


    // voter registration
    // Eligible voter must register intend to vote
    function registerMe(uint256 shares) public {
        // voter must have at least 1 share to voter
        // Its meaningless to vote if 1 voter have shares > quorum
        // quorum is in %
        require(shares>0 && shares*100 < proposalToVote.totalVotes*proposalToVote.quorum, "Invalid");
        
        // voting must already been setup, waiting for registration
        require(proposalToVote.state == State.WAIT, "Registration disallowed now");
        
        votersRegister[proposalToVote.registeredVoters].voter=msg.sender; // We store voter's address for matching later
        votersRegister[proposalToVote.registeredVoters].shares=shares;     // we store number of shares (votes) this voter has
        votersRegister[proposalToVote.registeredVoters].voted=false;      // 
        proposalToVote.registeredVoters++;
        
    } 


    // setup new voting : Administrator create new voting call
    // Setup proposal, ready for voting
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function newProposal(
            string memory name,         // Proposal name, like "HELIPAD"
            string memory description,  // , like "Proposal to build helicopter land pad"
            uint8   quorum,             // minimum supporting vote to pass resolution
            uint8   totalVotes,         // sum of legal votes of all voters, like 100 people total 160 votes as some voters has more votes
            uint8  TTL                  // Time to live in days, from beginVoting()
	) public {
	    
	    
	    ///values must be set when beginVoting() is called
	    proposalToVote.totalVotes=totalVotes;
	    proposalToVote.quorum=quorum;
	    proposalToVote.name=name;
	    proposalToVote.description=description;
	    proposalToVote.owner=msg.sender;
	    proposalToVote.TTL=TTL;
    }

    // start voting process, administrator call beginVoting() to start the voting
    function beginVoting() public {
        require(proposalToVote.state == State.WAIT, "Not ready yet"); // must be in WAIT state first
        require(proposalToVote.registeredVoters>3 && proposalToVote.totalVotes==0);// cant vote if less than 3 voters
        
        proposalToVote.usedByDate = now + proposalToVote.TTL;
        proposalToVote.state = State.READY;
    }


    // abort voting : Administrator call  abort, or perhaps we reached used-by-date and nobody ever voted
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function abort() public {
        require(proposalToVote.state != State.COMPLETED, "Cannot abort completed voting"); // can't abort completed voting
        
        proposalToVote.state=State.ABORTED;
        proposalToVote.outcome=Outcome.NONE;
    }


    // voting period expired : calculate the outcome
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function VotingIsOver() public {
        if (proposalToVote.yesVotes==0 && proposalToVote.noVotes==0){
            // nobody voted, so considered aborted
            proposalToVote.state = State.ABORTED;
            proposalToVote.outcome = Outcome.DEFEATED;
        }
        else if (proposalToVote.yesVotes/proposalToVote.totalVotes*100>proposalToVote.quorum){
                  // We have positive outcome, resolution is passed
                  // quorum is in %
                  proposalToVote.state = State.COMPLETED;
                  proposalToVote.outcome = Outcome.PASSED;
        }
        else {
            // negative outcome, proposal defeated
            proposalToVote.state = State.COMPLETED;
            proposalToVote.outcome = Outcome.DEFEATED;
        }
    }


    // voter cast his/her vote, a voter can only cast at most 1 vote, however voting is not compulsory
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function newVote(
        bool accept	// True to accept, False to reject
        ) public returns(bool) {


        // voter must be valid and not voted before and have >0 shares
        require(getShares(msg.sender)>0, "Cannot vote when voter does not have any share");
        
        // voter must have registered before, and have never voted before
        require(acceptVote(msg.sender), "Must register to vote, and at most 1 vote is allowed");
        

        
        // Must be in READY state to vote
        require(proposalToVote.state==State.READY, "Voting not allowed at the moment");
        
        bool result=false;
        
        if (accept){// (this) voter voted YES, 1 share = 1 vote
              proposalToVote.yesVotes+=getShares(msg.sender);
              result=true;
        }
        else {// this voter voted NO
            proposalToVote.noVotes+=getShares(msg.sender);
            result=true;
        }

        if (100*(proposalToVote.yesVotes/proposalToVote.totalVotes)>=proposalToVote.quorum){
              // Minimum YES votes (qourum) achieved //
              proposalToVote.outcome = Outcome.PASSED;
              
        }
        else {
             proposalToVote.outcome = Outcome.DEFEATED;
        }
      }
        
 
    }



