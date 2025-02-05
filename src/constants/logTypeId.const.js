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
    Agendas: {
      Create: 19,
      Update: 20,
      Delete: 21,
    },
    Topics: {
      Create: 22,
      Update: 23,
      Delete: 24,
    },
  },
  Task: {
    CommitteeTaskCreate: 7,
    MeetingTaskCreate: 8,
    MeetingTaskUpdate: 25,
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
