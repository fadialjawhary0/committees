import React, { useEffect, useState } from 'react';
import { UsersService } from '../services/admin.services';

const Users = () => {
  const [fetchedUsers, setFetchedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UsersService.getAll();
        setFetchedUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);
  return (
    <div>
      {fetchedUsers.map(user => (
        <div key={user.id}>
          <h2>{user.UserFullName}</h2>
          <p>{user.Email}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
