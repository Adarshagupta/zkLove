// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title zkLove - Privacy-First Dating Smart Contract
 * @dev Manages user registration, matching, and identity reveals using zero-knowledge proofs
 * @author zkLove Team
 * 
 * This contract handles:
 * - User registration with biometric commitments
 * - Privacy-preserving matching algorithms
 * - Selective identity disclosure with mutual consent
 * - Aura point system for reputation and gamification
 * - Proof verification for all privacy-critical operations
 */

contract zkLove {
    
    // ============ EVENTS ============
    
    event UserRegistered(address indexed user, bytes32 biometricCommitment, uint256 timestamp);
    event MatchProofSubmitted(address indexed user, bytes32 matchingHash, uint256 timestamp);
    event MutualMatchFound(address indexed user1, address indexed user2, uint256 compatibilityScore);
    event IdentityRevealed(address indexed revealer, address indexed recipient, uint256 auraReward);
    event AuraPointsAwarded(address indexed user, uint256 points, string reason);
    event AuraPointsDeducted(address indexed user, uint256 points, string reason);
    
    // ============ STRUCTS ============
    
    /**
     * @dev User profile stored on-chain with privacy-preserving commitments
     */
    struct UserProfile {
        bytes32 biometricCommitment;     // Hash of biometric features (never raw data)
        bytes32 preferencesHash;        // Hash of encrypted dating preferences  
        uint256 auraPoints;             // Reputation score and matching priority
        uint256 registrationTimestamp;  // When user registered
        uint256 lastActiveTimestamp;    // Last interaction timestamp
        bool isActive;                  // Whether user is available for matching
        bool isVerified;               // Whether user has completed verification
        uint256 totalMatches;          // Number of successful matches
        uint256 totalReveals;          // Number of identity reveals
    }
    
    /**
     * @dev Matching session data for privacy-preserving compatibility
     */
    struct MatchingSession {
        address user;                   // User submitting matching proof
        bytes32 matchingHash;          // Hash of matching preferences and proof
        uint256 auraThreshold;         // Minimum Aura required for matches
        uint256 timestamp;             // When matching session was created
        bool isActive;                 // Whether session is still active
    }
    
    /**
     * @dev Mutual match data when compatibility is found
     */
    struct MutualMatch {
        address user1;                 // First user in the match
        address user2;                 // Second user in the match
        uint256 compatibilityScore;   // Calculated compatibility (0-100)
        uint256 matchTimestamp;       // When match was found
        bool user1Revealed;           // Whether user1 has revealed identity
        bool user2Revealed;           // Whether user2 has revealed identity
        uint256 revealTimestamp;      // When mutual reveal completed
    }
    
    /**
     * @dev Zero-knowledge proof structure for verification
     */
    struct ZKProof {
        uint256[2] pi_a;              // Proof element A
        uint256[2][2] pi_b;           // Proof element B  
        uint256[2] pi_c;              // Proof element C
        uint256[] publicSignals;      // Public signals for verification
    }
    
    // ============ STATE VARIABLES ============
    
    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => MatchingSession) public matchingSessions;
    mapping(bytes32 => MutualMatch) public mutualMatches;
    mapping(address => mapping(address => bool)) public hasRevealed;
    
    // Aura system constants
    uint256 public constant REGISTRATION_AURA = 100;
    uint256 public constant MATCH_AURA = 75;
    uint256 public constant REVEAL_AURA = 150;
    uint256 public constant VERIFICATION_AURA = 100;
    
    // Contract state
    address public owner;
    uint256 public totalUsers;
    uint256 public totalMatches;
    uint256 public totalReveals;
    bool public contractPaused;
    
    // TODO: Add verification keys for different proof types
    // VerificationKey public registrationVKey;
    // VerificationKey public matchingVKey;
    // VerificationKey public unlockVKey;
    
    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier whenNotPaused() {
        require(!contractPaused, "Contract is paused");
        _;
    }
    
    modifier onlyRegisteredUser() {
        require(userProfiles[msg.sender].biometricCommitment != bytes32(0), "User not registered");
        _;
    }
    
    modifier onlyActiveUser() {
        require(userProfiles[msg.sender].isActive, "User not active");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        owner = msg.sender;
        contractPaused = false;
        
        // TODO: Initialize verification keys for ZK proof verification
        // registrationVKey = loadRegistrationVerificationKey();
        // matchingVKey = loadMatchingVerificationKey();
        // unlockVKey = loadUnlockVerificationKey();
    }
    
    // ============ USER REGISTRATION ============
    
    /**
     * @dev Registers a new user with biometric commitment and encrypted preferences
     * @param biometricCommitment Hash of user's biometric features (generated off-chain)
     * @param preferencesHash Hash of encrypted dating preferences
     * @param registrationProof ZK proof validating biometric commitment
     */
    function registerUser(
        bytes32 biometricCommitment,
        bytes32 preferencesHash,
        ZKProof memory registrationProof
    ) external whenNotPaused {
        require(userProfiles[msg.sender].biometricCommitment == bytes32(0), "User already registered");
        require(biometricCommitment != bytes32(0), "Invalid biometric commitment");
        
        // TODO: Verify registration proof using Mopro verification
        // require(verifyRegistrationProof(registrationProof, biometricCommitment), "Invalid registration proof");
        
        // Create user profile
        userProfiles[msg.sender] = UserProfile({
            biometricCommitment: biometricCommitment,
            preferencesHash: preferencesHash,
            auraPoints: REGISTRATION_AURA,
            registrationTimestamp: block.timestamp,
            lastActiveTimestamp: block.timestamp,
            isActive: true,
            isVerified: false,
            totalMatches: 0,
            totalReveals: 0
        });
        
        totalUsers++;
        
        emit UserRegistered(msg.sender, biometricCommitment, block.timestamp);
        emit AuraPointsAwarded(msg.sender, REGISTRATION_AURA, "Registration");
    }
    
    /**
     * @dev Updates user preferences with new encrypted hash
     * @param newPreferencesHash New hash of encrypted preferences
     * @param updateProof ZK proof authorizing preference update
     */
    function updatePreferences(
        bytes32 newPreferencesHash,
        ZKProof memory updateProof
    ) external onlyRegisteredUser whenNotPaused {
        require(newPreferencesHash != bytes32(0), "Invalid preferences hash");
        
        // TODO: Verify update proof
        // require(verifyUpdateProof(updateProof, msg.sender), "Invalid update proof");
        
        userProfiles[msg.sender].preferencesHash = newPreferencesHash;
        userProfiles[msg.sender].lastActiveTimestamp = block.timestamp;
        
        // TODO: Emit PreferencesUpdated event
    }
    
    // ============ PRIVACY-PRESERVING MATCHING ============
    
    /**
     * @dev Submits a matching session with ZK proof of preferences
     * @param matchingHash Hash of matching preferences and compatibility criteria
     * @param auraThreshold Minimum Aura score required for matches
     * @param matchingProof ZK proof of matching preferences without revealing them
     */
    function submitMatchingProof(
        bytes32 matchingHash,
        uint256 auraThreshold,
        ZKProof memory matchingProof
    ) external onlyRegisteredUser onlyActiveUser whenNotPaused {
        require(matchingHash != bytes32(0), "Invalid matching hash");
        
        // TODO: Verify matching proof using Mopro
        // require(verifyMatchingProof(matchingProof, matchingHash), "Invalid matching proof");
        
        // Create or update matching session
        matchingSessions[matchingHash] = MatchingSession({
            user: msg.sender,
            matchingHash: matchingHash,
            auraThreshold: auraThreshold,
            timestamp: block.timestamp,
            isActive: true
        });
        
        userProfiles[msg.sender].lastActiveTimestamp = block.timestamp;
        
        emit MatchProofSubmitted(msg.sender, matchingHash, block.timestamp);
        
        // TODO: Trigger matching algorithm to find compatible users
        // _findCompatibleMatches(matchingHash);
    }
    
    /**
     * @dev Records a mutual match between two users
     * @param user1 First user in the match
     * @param user2 Second user in the match  
     * @param compatibilityScore Calculated compatibility score (0-100)
     * @param matchProof ZK proof of mutual compatibility
     */
    function recordMutualMatch(
        address user1,
        address user2,
        uint256 compatibilityScore,
        ZKProof memory matchProof
    ) external onlyOwner whenNotPaused {
        require(user1 != user2, "Cannot match with self");
        require(userProfiles[user1].isActive && userProfiles[user2].isActive, "Both users must be active");
        require(compatibilityScore <= 100, "Invalid compatibility score");
        
        // TODO: Verify mutual compatibility proof
        // require(verifyMutualCompatibilityProof(matchProof, user1, user2), "Invalid match proof");
        
        bytes32 matchId = keccak256(abi.encodePacked(user1, user2, block.timestamp));
        
        mutualMatches[matchId] = MutualMatch({
            user1: user1,
            user2: user2,
            compatibilityScore: compatibilityScore,
            matchTimestamp: block.timestamp,
            user1Revealed: false,
            user2Revealed: false,
            revealTimestamp: 0
        });
        
        // Award Aura points for successful match
        userProfiles[user1].auraPoints += MATCH_AURA;
        userProfiles[user2].auraPoints += MATCH_AURA;
        userProfiles[user1].totalMatches++;
        userProfiles[user2].totalMatches++;
        
        totalMatches++;
        
        emit MutualMatchFound(user1, user2, compatibilityScore);
        emit AuraPointsAwarded(user1, MATCH_AURA, "Mutual Match");
        emit AuraPointsAwarded(user2, MATCH_AURA, "Mutual Match");
    }
    
    // ============ SELECTIVE IDENTITY DISCLOSURE ============
    
    /**
     * @dev Initiates identity reveal with mutual consent verification
     * @param matchId ID of the mutual match
     * @param revealCommitments Commitments to information being revealed
     * @param unlockProof ZK proof of reveal authorization and mutual consent
     */
    function initiateIdentityReveal(
        bytes32 matchId,
        bytes32[] memory revealCommitments,
        ZKProof memory unlockProof
    ) external onlyRegisteredUser whenNotPaused {
        MutualMatch storage match = mutualMatches[matchId];
        require(match.user1 == msg.sender || match.user2 == msg.sender, "Not part of this match");
        require(match.matchTimestamp > 0, "Match does not exist");
        
        // TODO: Verify unlock proof and mutual consent
        // require(verifyUnlockProof(unlockProof, matchId, msg.sender), "Invalid unlock proof");
        // require(verifyMutualConsent(matchId, unlockProof), "Mutual consent not achieved");
        
        // Mark user as having revealed
        if (match.user1 == msg.sender) {
            match.user1Revealed = true;
        } else {
            match.user2Revealed = true;
        }
        
        // Check if both users have revealed
        if (match.user1Revealed && match.user2Revealed) {
            match.revealTimestamp = block.timestamp;
            
            // Award Aura points for successful mutual reveal
            userProfiles[match.user1].auraPoints += REVEAL_AURA;
            userProfiles[match.user2].auraPoints += REVEAL_AURA;
            userProfiles[match.user1].totalReveals++;
            userProfiles[match.user2].totalReveals++;
            
            totalReveals++;
            
            emit IdentityRevealed(match.user1, match.user2, REVEAL_AURA);
            emit IdentityRevealed(match.user2, match.user1, REVEAL_AURA);
            emit AuraPointsAwarded(match.user1, REVEAL_AURA, "Identity Reveal");
            emit AuraPointsAwarded(match.user2, REVEAL_AURA, "Identity Reveal");
        }
        
        hasRevealed[msg.sender][matchId == keccak256(abi.encodePacked(match.user1, match.user2, match.matchTimestamp)) ? match.user1 : match.user2] = true;
    }
    
    // ============ AURA POINT SYSTEM ============
    
    /**
     * @dev Awards bonus Aura points for special achievements
     * @param user User to award points to
     * @param points Number of points to award
     * @param reason Reason for the award
     */
    function awardBonusAura(
        address user,
        uint256 points,
        string memory reason
    ) external onlyOwner whenNotPaused {
        require(userProfiles[user].biometricCommitment != bytes32(0), "User not registered");
        
        userProfiles[user].auraPoints += points;
        
        emit AuraPointsAwarded(user, points, reason);
    }
    
    /**
     * @dev Deducts Aura points for violations or penalties
     * @param user User to deduct points from
     * @param points Number of points to deduct
     * @param reason Reason for the deduction
     */
    function deductAura(
        address user,
        uint256 points,
        string memory reason
    ) external onlyOwner whenNotPaused {
        require(userProfiles[user].biometricCommitment != bytes32(0), "User not registered");
        
        if (userProfiles[user].auraPoints >= points) {
            userProfiles[user].auraPoints -= points;
        } else {
            userProfiles[user].auraPoints = 0;
        }
        
        emit AuraPointsDeducted(user, points, reason);
    }
    
    // ============ USER MANAGEMENT ============
    
    /**
     * @dev Sets user active/inactive status
     * @param isActive Whether user should be active for matching
     */
    function setActiveStatus(bool isActive) external onlyRegisteredUser whenNotPaused {
        userProfiles[msg.sender].isActive = isActive;
        userProfiles[msg.sender].lastActiveTimestamp = block.timestamp;
        
        // TODO: Emit StatusChanged event
    }
    
    /**
     * @dev Verifies user profile (manual verification by admin)
     * @param user User to verify
     */
    function verifyUser(address user) external onlyOwner whenNotPaused {
        require(userProfiles[user].biometricCommitment != bytes32(0), "User not registered");
        
        userProfiles[user].isVerified = true;
        userProfiles[user].auraPoints += VERIFICATION_AURA;
        
        emit AuraPointsAwarded(user, VERIFICATION_AURA, "Profile Verification");
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Gets user's public profile information
     * @param user User address to query
     * @return UserProfile struct with public information
     */
    function getUserProfile(address user) external view returns (UserProfile memory) {
        return userProfiles[user];
    }
    
    /**
     * @dev Gets matching session information
     * @param matchingHash Hash of the matching session
     * @return MatchingSession struct
     */
    function getMatchingSession(bytes32 matchingHash) external view returns (MatchingSession memory) {
        return matchingSessions[matchingHash];
    }
    
    /**
     * @dev Gets mutual match information
     * @param matchId ID of the mutual match
     * @return MutualMatch struct
     */
    function getMutualMatch(bytes32 matchId) external view returns (MutualMatch memory) {
        return mutualMatches[matchId];
    }
    
    /**
     * @dev Checks if user has revealed identity to another user
     * @param revealer User who revealed
     * @param recipient User who received reveal
     * @return bool indicating if reveal occurred
     */
    function hasUserRevealed(address revealer, address recipient) external view returns (bool) {
        return hasRevealed[revealer][recipient];
    }
    
    /**
     * @dev Gets contract statistics
     * @return totalUsers Total registered users
     * @return totalMatches Total mutual matches
     * @return totalReveals Total identity reveals
     */
    function getContractStats() external view returns (uint256, uint256, uint256) {
        return (totalUsers, totalMatches, totalReveals);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Pauses/unpauses the contract
     * @param paused Whether to pause the contract
     */
    function setPaused(bool paused) external onlyOwner {
        contractPaused = paused;
    }
    
    /**
     * @dev Updates contract owner
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
    
    // ============ PROOF VERIFICATION PLACEHOLDERS ============
    
    /**
     * @dev Verifies registration proof (TODO: implement with Mopro)
     * @param proof ZK proof to verify
     * @param biometricCommitment Expected biometric commitment
     * @return bool indicating if proof is valid
     */
    function verifyRegistrationProof(
        ZKProof memory proof,
        bytes32 biometricCommitment
    ) internal pure returns (bool) {
        // TODO: Implement actual proof verification using Mopro verifier
        // return MoproVerifier.verifyProof(registrationVKey, proof, [biometricCommitment]);
        
        // Mock verification for development
        return proof.publicSignals.length > 0 && biometricCommitment != bytes32(0);
    }
    
    /**
     * @dev Verifies matching proof (TODO: implement with Mopro)
     * @param proof ZK proof to verify
     * @param matchingHash Expected matching hash
     * @return bool indicating if proof is valid
     */
    function verifyMatchingProof(
        ZKProof memory proof,
        bytes32 matchingHash
    ) internal pure returns (bool) {
        // TODO: Implement actual proof verification
        return proof.publicSignals.length > 0 && matchingHash != bytes32(0);
    }
    
    /**
     * @dev Verifies unlock proof for identity reveal (TODO: implement with Mopro)
     * @param proof ZK proof to verify
     * @param matchId Match ID for reveal
     * @param user User initiating reveal
     * @return bool indicating if proof is valid
     */
    function verifyUnlockProof(
        ZKProof memory proof,
        bytes32 matchId,
        address user
    ) internal pure returns (bool) {
        // TODO: Implement actual proof verification
        return proof.publicSignals.length > 0 && matchId != bytes32(0) && user != address(0);
    }
}
