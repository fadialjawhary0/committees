import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CommitteeDetails.module.scss';
import Logger from './Logger';
import VotingModal from '../../../components/VotingModal';
import VotingSystem from '../../../components/VotingSystem';
import Discussions from './Discussions';
import { MeetingStatus } from '../../../constants';
import apiService from '../../../services/axiosApi.service';
import CommitteeTasks from './CommitteeTasks';
import MeetingTasks from './MeetingTasks';
import CommitteeHeader from './CommitteeHeader';
import CommitteeAttachments from './CommitteeAttachments';
import CommitteeUpcomingMeetings from './CommitteeUpcomingMeetings';
import CommitteePastMeetings from './CommitteePastMeetings';
import CommitteeMembers from './CommitteeMembers';

const mockLogs = [
  { id: 1, user: { name: 'Ahmed Ali' }, action: 'أضاف اجتماع جديد', time: '2024-09-01T10:00:00' },
  { id: 2, user: { name: 'Fatima Hassan' }, action: 'رفع ملف مستندات', time: '2024-09-02T12:30:00' },
  { id: 3, user: { name: 'Sara Ahmad' }, action: 'حدث بيانات اللجنة', time: '2024-09-03T09:15:00' },
  { id: 4, user: { name: 'Mohammed Saleh' }, action: 'أضاف عضو جديد', time: '2024-09-04T14:45:00' },
  { id: 5, user: { name: 'Khaled Youssef' }, action: 'حذف ملف', time: '2024-09-05T16:20:00' },
];

const CommitteeDetails = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

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
          .getById('GetAllVoteByCommittee', `${+localStorage.getItem('selectedCommitteeID')}/${null}`)
          .then(res => setVotings([...res]));

        const userID = localStorage.getItem('userID');
        localStorage.setItem('memberID', committeeDetails?.Members?.find(u => u?.UserID === +userID)?.ID);
      } catch {
        console.log('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loading, id]);

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
      Question: newVoting?.question,
      CreatedBy: +localStorage.getItem('memberID'),
      IsActive: true,
      Choices: newVoting?.Choices,
    };
    await apiService.create('CreateVoteWithChoices', data);
    await apiService
      .getById('GetAllVoteByCommittee', `${+localStorage.getItem('selectedCommitteeID')}/${+localStorage.getItem('memberId')}`)
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
        <Logger logs={mockLogs} />
      </div>

      <VotingSystem votings={votings} handleVote={handleVote} addNewVoting={addNewVoting} />

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
