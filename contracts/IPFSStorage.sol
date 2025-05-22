// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.28;
contract IPFSStorage {
    string public fileCID;
    string public imageCID;
    
    function setCID(string memory _cid) public {
        fileCID = _cid;
    }
    
    function getCID() public view returns (string memory) {
        return fileCID;
    }
    
    function setImageCID(string memory _imageCID) public {
        imageCID = _imageCID;
    }
    
    function getImageCID() public view returns (string memory) {
        return imageCID;
    }
}
