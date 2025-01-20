import React, { useEffect, useState } from 'react';
import { FaTrash, FaPen, FaUser } from 'react-icons/fa';
import styles from './Users.module.scss';
import { useNavigate } from 'react-router-dom';
import UsersFilters from './UsersFilters';
import apiService from '../../../services/axiosApi.service';

const peopleData = [
  { id: 1, name: 'Ahmed Ali', committees: ['Committee 1', 'Committee 2'] },
  { id: 2, name: 'Fatima Hassan', committees: ['Committee 3'] },
  { id: 3, name: 'Mohammed Saleh', committees: ['Committee 1'] },
  { id: 4, name: 'Sara Ahmad', committees: ['Committee 2', 'Committee 3'] },
  { id: 5, name: 'Khaled Youssef', committees: ['Committee 3'] },
  { id: 6, name: 'Amal Nasser', committees: ['Committee 1', 'Committee 2'] },
  { id: 7, name: 'Rania Omar', committees: ['Committee 2'] },
  { id: 8, name: 'Yousef Al-Qassim', committees: ['Committee 3'] },
  { id: 9, name: 'Hiba Mustafa', committees: ['Committee 1'] },
  { id: 10, name: 'Omar Hussein', committees: ['Committee 2', 'Committee 3'] },
  { id: 11, name: 'Nour Al-Din', committees: ['Committee 1'] },
  { id: 12, name: 'Ayman Ziad', committees: ['Committee 2', 'Committee 3'] },
  { id: 13, name: 'Lina Mahmoud', committees: ['Committee 3'] },
  { id: 14, name: 'Rami Ibrahim', committees: ['Committee 1', 'Committee 2'] },
  { id: 15, name: 'Fadi Hassan', committees: ['Committee 2'] },
  { id: 16, name: 'Maha Khalil', committees: ['Committee 3'] },
  { id: 17, name: 'Alaa Sami', committees: ['Committee 1'] },
  { id: 18, name: 'Hassan Younes', committees: ['Committee 2', 'Committee 3'] },
  { id: 19, name: 'Dina Adel', committees: ['Committee 1'] },
  { id: 20, name: 'Bashar Al-Sayed', committees: ['Committee 2', 'Committee 3'] },
  { id: 21, name: 'Sahar Ramzi', committees: ['Committee 3'] },
  { id: 22, name: 'Nasser Fouad', committees: ['Committee 1', 'Committee 2'] },
  { id: 23, name: 'Hana Saleh', committees: ['Committee 2'] },
  { id: 24, name: 'Ayman Hassan', committees: ['Committee 3'] },
  { id: 25, name: 'Laila Mahmoud', committees: ['Committee 1'] },
];

const committeeOptions = [
  { value: 'الكل', label: 'كل اللجان' },
  { value: 'Committee 1', label: 'Committee 1' },
  { value: 'Committee 2', label: 'Committee 2' },
  { value: 'Committee 3', label: 'Committee 3' },
];

const Users = () => {
  const navigate = useNavigate();

  const [people, setPeople] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCommittee, setSelectedCommittee] = useState('');
  const usersPerPage = 15;

  // const handleDelete = id => {
  //   const updatedPeople = people.filter(person => person.id !== id);
  //   setPeople(updatedPeople);
  // };

  // const handleAdd = () => {
  //   navigate('/users/add-user');
  // };

  // const handleEdit = id => {
  //   navigate(`/users/edit-user/${id}`);
  // };

  // const handleFilterChange = selectedValue => {
  //   setSelectedCommittee(selectedValue);
  //   setCurrentPage(1);
  // };

  const filteredPeople =
    selectedCommittee === 'الكل' || !selectedCommittee
      ? people
      : people?.filter(person => person.committees.includes(selectedCommittee));

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredPeople?.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredPeople.length / usersPerPage) || 0;

  const paginate = pageNumber => setCurrentPage(pageNumber);
  useEffect(() => {
    const fetchedUsers = async () => {
      const people = await apiService.getById('GetAllMember', +localStorage.getItem('selectedCommitteeID'));
      setPeople(people);
    };
    fetchedUsers();
  }, []);
  return (
    <div className={styles.peoplePage}>
      {/* <UsersFilters handleAdd={handleAdd} handleFilterChange={handleFilterChange} committeeOptions={committeeOptions} /> */}

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>الصورة الشخصية</th>
              <th>الاسم</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers?.map(person => (
              <tr key={person?.ID}>
                <td>
                  <div className={styles.profilePicture}>
                    <div className={styles.profilePlaceholder}>
                      <FaUser />
                    </div>
                  </div>
                </td>
                <td>{person?.Name}</td>
                {/* <td>
                  <button className={styles.editButton} onClick={() => handleEdit(person.ID)}>
                    <FaPen />
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(person.ID)}>
                    <FaTrash />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        {[...Array(totalPages).keys()]?.map(page => (
          <button
            key={page + 1}
            onClick={() => paginate(page + 1)}
            className={`${styles.pageButton} ${currentPage === page + 1 ? styles.active : ''}`}>
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Users;
