import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { UserContext, EventsContext } from '../../Context';

import { db, auth, analytics } from '../../modules/firebase';
import firebase from 'firebase/compat/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Chat from '../../components/Chat';
import { VideoPlayer } from '../../components/VideoPlayer';
import Trivia from '../../components/Poll/Trivia';

import { MOVIES } from '../../helpers/constants';

import { slugify } from '../../helpers/helperFunctions';

import '../../styles/Event.scss';

function Event(props) {
  const campaigns = props.campaigns;
  const setUser = props.setUser;

  const { eventId } = useParams();
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  // const selectedColor = queryParams.get("color");
  const [currentCampaign, setCurrentCampaign] = useState(null);

  useEffect(() => {
    setCurrentCampaign(
      campaigns && campaigns.find((c) => slugify(c.title) === eventId)
    );
  }, [campaigns]);

  return (
    <div
      className={
        (currentCampaign && currentCampaign.alwaysOn.video ? 'live ' : '') +
        'event'
      }
    >
      <section className="main">
        <Trivia />
        {currentCampaign && currentCampaign.alwaysOn.video
          ? [<VideoPlayer video={currentCampaign.video.source} />]
          : null}
        <div
          className="text-block"
          style={{
            backgroundImage:
              currentCampaign && currentCampaign.styles
                ? `linear-gradient(to bottom, rgba(245, 246, 252, 0.0), rgba(117, 19, 93, 0.73))`
                : 'none',
          }}
        >
          <h1>{currentCampaign && currentCampaign.artist}</h1>
          <h2>{currentCampaign && currentCampaign.title}</h2>
          <p>{currentCampaign && currentCampaign.description}</p>
        </div>
        <div
          className="bg"
          style={{
            backgroundImage: currentCampaign
              ? `url(${currentCampaign.banner})`
              : 'none',
          }}
        ></div>
      </section>
      <section className="rail">
        <Chat />
      </section>
    </div>
  );
}

export default Event;
