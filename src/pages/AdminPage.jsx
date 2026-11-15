import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import './AdminPage.scss';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      const { data, error: fetchError } = await supabase
        .rpc('get_registered_users');

      if (!active) return;

      if (fetchError) {
        setError('Unable to load registered users.');
      } else {
        setUsers(data ?? []);
      }

      setLoading(false);
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <h1>Admin - Registered Users</h1>
        <p>View registered NextQuest accounts.</p>
      </div>

      {loading ? (
        <p className="admin-message" role="status">
          Loading registered users...
        </p>
      ) : error ? (
        <p className="admin-error" role="alert">
          {error}
        </p>
      ) : (
        <>
          <div className="admin-summary">
            <h2>Total Registered Users</h2>
            <p className="admin-user-count">{users.length}</p>
          </div>

          {users.length === 0 ? (
            <p className="admin-message">
              No registered users found.
            </p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.user_id}>
                      <td>{user.email}</td>
                      <td>
                        {new Date(
                          user.created_at
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;
