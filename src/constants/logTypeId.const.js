export const LogTypes = {
  Committee: {
    Create: 1,
    Update: 3,
    Delete: 2,
  },
  Meeting: {
    Create: 4,
    Update: 6,
    Delete: 5,
  },
  Task: {
    CommitteeTaskCreate: 7,
    MeetingTaskCreate: 8,
  },
  Files: {
    Create: 9,
    Delete: 10,
    Update: 11,
  },
  Votings: {
    Create: 12,
  },
  AddMembers: {
    CommitteeMemberAdd: 13,
    MeetingMemberAdd: 14,
  },
  DeleteMembers: {
    CommitteeMemberDelete: 15,
    MeetingMemberDelete: 16,
  },
};
