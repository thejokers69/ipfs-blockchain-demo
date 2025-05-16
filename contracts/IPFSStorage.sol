// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.28;
contract IPFSStorage {
    string public fileCID;
    function setCID(string memory _cid) public {
        fileCID = _cid;
    }
    function getCID() public view returns (string memory) {
        return fileCID;
    }
}
