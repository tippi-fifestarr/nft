// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Dusty is Ownable, ERC721 {

    struct Metadata {
        uint16 year;
        uint8 month;
        uint8 day;
        string name;
        string class;
        string race;
        string catchphrase;
    }

    mapping(uint256 => Metadata) id_to_char;

    constructor() public ERC721("Name, Class Race", "CHAR") {
        // borrowing this for the first draft
        _setBaseURI("https://date.kie.codes/token/");

        mint(1, 1, 1, "ORIGIN", "World", "Earth", "Let there be dates");
        (uint16 now_year, uint8 now_month, uint8 now_day) = timestampToDate(now);
        mint(now_year, now_month, now_day, "Baby Dragon", "dragon baby", "fuckin Dragon", "i'm the baby, gotta love me (burn them!)");
        mint(now_year-223, now_month, now_day, "Dusty D_fifestar", "ranger", "elf", "timber me puddles!");
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _setBaseURI(baseURI);
    }

    function mint(
        uint16 year, uint8 month, uint8 day, 
        string memory name, string memory class, string memory race, string memory catchphrase
        ) internal {
        uint256 tokenId = id(year, month, day);
        
        id_to_char[tokenId] = Metadata(year, month, day, name, class, race, catchphrase);
        _safeMint(msg.sender, tokenId);
    }

    function claim(
        uint16 year, uint8 month, uint8 day, 
        string calldata name, string calldata class, string calldata race, 
        string calldata catchphrase
        ) external payable {
        require(msg.value == 10 gwei, "claiming a Character costs 10 Gwei");

        (uint16 now_year, uint8 now_month, uint8 now_day) = timestampToDate(now);
        if ((year > now_year) || 
            (year == now_year && month > now_month) || 
            (year == now_year && month == now_month && day > now_day)) {
            revert("a date from the future can't be your birthday!");
        }

        mint(year, month, day, name, class, race, catchphrase);
        payable(owner()).transfer(10 gwei);
    }

    function ownerOf(uint16 year, uint8 month, uint8 day) public view returns(address) {
        return ownerOf(id(year, month, day));
    }

    function id(uint16 year, uint8 month, uint8 day) pure internal returns(uint256) {
        require(1 <= day && day <= numDaysInMonth(month, year));
        return (uint256(year)-1)*372 + (uint256(month)-1)*31 + uint256(day)-1;
    }

    function get(uint256 tokenId) external view returns (uint16 year, uint8 month, uint8 day, string memory name, string memory class, string memory race, string memory catchphrase) {
        require(_exists(tokenId), "character (tokenId) not minted yet");
        Metadata memory char = id_to_char[tokenId];
        year = char.year;
        month = char.month;
        day = char.day;
        name = char.name;
        class = char.class;
        race = char.race;
        catchphrase = char.catchphrase;
    }

    function catchphraseOf(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "token not minted");
        Metadata memory char = id_to_char[tokenId];
        return char.catchphrase;
    }

    function catchphraseOf(uint16 year, uint8 month, uint8 day) external view returns (string memory) {
        require(_exists(id(year, month, day)), "token not minted");
        Metadata memory char = id_to_char[id(year, month, day)];
        return char.catchphrase;
    }

    function changeCatchphraseOf(uint16 year, uint8 month, uint8 day, string memory catchphrase) external {
        require(_exists(id(year, month, day)), "token not minted");
        changeCatchphraseOf(id(year, month, day), catchphrase);
    }

    function changeCatchphraseOf(uint256 tokenId, string memory catchphrase) public {
        require(_exists(tokenId), "token not minted");
        require(ownerOf(tokenId) == msg.sender, "only the owner of this char can change its catchphrase");
        id_to_char[tokenId].catchphrase = catchphrase;
    }

    function isLeapYear(uint16 year) public pure returns (bool) {
        require(1 <= year, "year must be bigger or equal 1");
        return (year % 4 == 0) 
            && (year % 100 == 0)
            && (year % 400 == 0);
    }

    function numDaysInMonth(uint8 month, uint16 year) public pure returns (uint8) {
        require(1 <= month && month <= 12, "month must be between 1 and 12");
        require(1 <= year, "year must be bigger or equal 1");

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            return 31;
        }
        else if (month == 2) {
            return isLeapYear(year) ? 29 : 28;
        }
        else {
            return 30;
        }
    }

    function timestampToDate(uint timestamp) public pure returns (uint16 year, uint8 month, uint8 day) {
        int z = int(timestamp / 86400 + 719468);
        int era = (z >= 0 ? z : z - 146096) / 146097;
        uint doe = uint(z - era * 146097);
        uint yoe = (doe - doe/1460 + doe/36524 - doe/146096) / 365;
        uint doy = doe - (365*yoe + yoe/4 - yoe/100);
        uint mp = (5*doy + 2)/153;

        day = uint8(doy - (153*mp+2)/5 + 1);
        month = mp < 10 ? uint8(mp + 3) : uint8(mp - 9);
        year = uint16(int(yoe) + era * 400 + (month <= 2 ? 1 : 0));
    }
}