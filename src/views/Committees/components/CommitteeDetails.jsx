import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LogTypes, MeetingStatus } from '../../../constants';

import VotingModal from '../../../components/VotingModal';
import VotingSystem from '../../../components/VotingSystem';
import apiService from '../../../services/axiosApi.service';

import Logger from './CommitteeDetails/Logger';
import Discussions from './CommitteeDetails/Discussions';
import CommitteeTasks from './CommitteeDetails/CommitteeTasks';
import MeetingTasks from './CommitteeDetails/MeetingTasks';
import CommitteeHeader from './CommitteeDetails/CommitteeHeader';
import CommitteeAttachments from './CommitteeDetails/CommitteeAttachments';
import CommitteeUpcomingMeetings from './CommitteeDetails/CommitteeUpcomingMeetings';
import CommitteePastMeetings from './CommitteeDetails/CommitteePastMeetings';
import CommitteeMembers from './CommitteeDetails/CommitteeMembers';

import styles from './CommitteeDetails.module.scss';

const CommitteeDetails = () => {
  const { id } = useParams();

  const [newVoting, setNewVoting] = useState({ Question: '', Choices: [] });
  const [newOption, setNewOption] = useState('');

  const [votings, setVotings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState({
    user: false,
    voting: false,
    deleteMeeting: false,
    deleteCommittee: false,
  });
  const [fetchedCommitteeData, setFetchedCommitteeData] = useState({
    Committee: {},
    Members: [],
    PreviousMeetings: [],
    UpcomingMeetings: [],
    RelatedAttachments: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const committeeDetails = await apiService.getById('GetCommittee', localStorage.getItem('selectedCommitteeID'));

        setFetchedCommitteeData({
          Committee: committeeDetails?.CommitteeDetails,
          Members: committeeDetails?.Members,
          PreviousMeetings: committeeDetails?.Meetings?.filter(pm => pm?.StatusId === MeetingStatus?.Completed),
          UpcomingMeetings: committeeDetails?.Meetings?.filter(um => um?.StatusId === MeetingStatus?.Upcoming),
          RelatedAttachments: committeeDetails?.RelatedAttachments,
        });

        await apiService
          .getById(
            'GetAllVoteByCommittee',
            `${+localStorage.getItem('selectedCommitteeID')}/${+localStorage.getItem('memberID')}`,
          )
          .then(res => setVotings([...res]));

        const userID = localStorage.getItem('userID');
        localStorage.setItem('memberID', committeeDetails?.Members?.find(u => u?.UserID === +userID)?.ID);
      } catch {
        console.log('error');
      }
    };

    fetchData();
  }, []);

  const addNewVoting = () => {
    setIsModalOpen({ ...isModalOpen, voting: true });
    setNewVoting({ Question: '', Choices: [] });
  };

  const handleSaveVoting = async () => {
    if (!newVoting?.Question?.trim()?.length || !newVoting?.Choices?.length) {
      alert('Please enter a question and at least one option.');
      return;
    }

    const data = {
      CommitteeID: +localStorage.getItem('selectedCommitteeID'),
      StartDate: new Date().toISOString(),
      EndDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
      Question: newVoting?.Question,
      CreatedBy: +localStorage.getItem('memberID'),
      IsActive: true,
      Choices: newVoting?.Choices,
    };
    await apiService.create('CreateVoteWithChoices', data, LogTypes?.Votings?.Create);
    await apiService
      .getById('GetAllVoteByCommittee', `${+localStorage.getItem('selectedCommitteeID')}/${+localStorage.getItem('memberID')}`)
      .then(res => setVotings([...res]));
    setIsModalOpen({ ...isModalOpen, voting: false });
  };

  const handleAddOption = () => {
    if (newOption?.trim()?.length) {
      setNewVoting(prev => ({
        ...prev,
        Choices: [...prev?.Choices, newOption],
      }));
      setNewOption('');
    }
  };

  const handleCancel = () => {
    setIsModalOpen({ ...isModalOpen, voting: false });
  };

  const handleVote = async (votingId, optionId) => {
    const data = {
      VoteID: votingId,
      MemberID: +localStorage.getItem('memberID'),
      ChoiceID: optionId,
    };
    await apiService.create('AddVotesCasts', data)?.then(res => {
      setVotings(prev =>
        prev?.map(voting =>
          voting.ID === votingId
            ? {
                ...voting,
                Choices: res,
              }
            : voting,
        ),
      );
    });
  };

  if (!fetchedCommitteeData) return <p>Loading...</p>;

  return (
    <div>
      <CommitteeHeader setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} committee={fetchedCommitteeData?.Committee} />

      {/************* Page Header 4 Cards ****************/}
      <div className={styles.committeeDashboard}>
        <CommitteeAttachments attachments={fetchedCommitteeData?.RelatedAttachments} />
        <CommitteeUpcomingMeetings
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          meetings={fetchedCommitteeData?.UpcomingMeetings}
          setFetchedCommitteeData={setFetchedCommitteeData}
        />
        <CommitteePastMeetings meetings={fetchedCommitteeData?.PreviousMeetings} />
        <CommitteeMembers
          members={fetchedCommitteeData?.Members}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          setFetchedCommitteeDetails={setFetchedCommitteeData}
        />
      </div>

      {/************* Tasks Section ****************/}
      <div className={styles.gridContainer}>
        <MeetingTasks />
        <CommitteeTasks />
      </div>

      {/************* Discussions and Logger Section ****************/}
      <div className={styles.gridContainer}>
        <Discussions id={id} />
        <Logger />
      </div>

      <VotingSystem
        votings={votings}
        handleVote={handleVote}
        addNewVoting={addNewVoting}
        numOfMembers={fetchedCommitteeData?.Members?.length}
      />

      <VotingModal
        isModalOpen={isModalOpen.voting}
        handleSaveVoting={handleSaveVoting}
        handleCancel={handleCancel}
        handleAddOption={handleAddOption}
        newVoting={newVoting}
        newOption={newOption}
        setNewVoting={setNewVoting}
        setNewOption={setNewOption}
      />
    </div>
  );
};

export default CommitteeDetails;
