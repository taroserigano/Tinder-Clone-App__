import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

// {!clickedUser && <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser}/>}
// these are "his" matches = user.matches
const MatchesDisplay = ({ matches, setClickedUser }) => {
  const [matchedProfiles, setMatchedProfiles] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  
  // just extract the "user ID" from all matches
  const matchedUserIds = matches.map(({ user_id }) => user_id);
  const userId = cookies.UserId;

  const getMatches = async () => {
    try {
      // then get the data from the DB
      // then set them in matched profile
      const response = await axios.get("http://localhost:8000/users", {
        params: { userIds: JSON.stringify(matchedUserIds) },
      });
      setMatchedProfiles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatches();
  }, [matches]);
  
  // from matched profiles, filter out, are their matches.matches == me ?
  // these are the users who you "matched" with 
  const filteredMatchedProfiles = matchedProfiles?.filter(
    (matchedProfile) =>
      matchedProfile.matches.filter((profile) => profile.user_id == userId)
        .length > 0
  );

  return (
    <div className="matches-display">
    // filteredMatchedProfiles are = my matches
      {filteredMatchedProfiles?.map((match, _index) => (
        <div
          key={_index}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
          <div className="img-container">
            <img src={match?.url} alt={match?.first_name + " profile"} />
          </div>
          <h3>{match?.first_name}</h3>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;
