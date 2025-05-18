import React, { useState, useEffect } from 'react';
import { saveUser, getAllUsers } from '../api/users-api';
import { Mail, Phone, Wallet, Plus, Save, X, Bell, Globe } from 'lucide-react';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'popup/logo.png' : 'popup/logo-dark.png';

  const bgColor = isLight ? 'bg-gray-50' : 'bg-gray-900';
  const textColor = isLight ? 'text-black' : 'text-white';
  const cardBg = isLight ? 'bg-white' : 'bg-gray-800';
  const cardBorder = isLight ? 'border-gray-200' : 'border-gray-700';
  const secondaryText = isLight ? 'text-gray-700' : 'text-gray-300';
  const tertiaryText = isLight ? 'text-gray-600' : 'text-gray-400';
  const inputBg = isLight ? 'bg-white' : 'bg-gray-800';
  const inputBorder = isLight ? 'border-gray-300' : 'border-gray-600';

  const [users, setUsers] = useState<{ email: string; mobilePhone: string; address: string }[]>([]);
  const [email, setEmail] = useState('');
  const [mobilePhone, setPhone] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(err => console.error('Failed to load users:', err));
  }, []);

  const addUser = async () => {
    if (!email || !mobilePhone || !ethAddress) return;
    const newUser = { email, mobilePhone: mobilePhone, address: ethAddress };
    try {
      const savedUser = await saveUser(newUser);
      setUsers(prevUsers => [...prevUsers, savedUser]);
      setEmail('');
      setPhone('');
      setEthAddress('');
      setShowNewEntryForm(false);
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const inputClass = `mb-3 w-full p-3 rounded-lg ${inputBg} ${inputBorder} border shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`;

  const buttonClass = 'w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2';

  return (
    <div className={`w-[360px] min-h-[500px] p-4 rounded-xl ${bgColor} ${textColor} shadow-xl`}>
      <div className="flex items-center justify-center mb-4">
        <img style={{ maxWidth: '150px' }} src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
      </div>

      <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <>
          {users.length === 0 ? (
            <div className={`text-center py-8 ${tertiaryText} text-sm`}>No alerts yet. Add your first one below!</div>
          ) : (
            <div className="max-h-[280px] overflow-y-auto pr-1 space-y-3">
              {users.map((user, i) => (
                <div key={i} className={`p-4 rounded-lg ${cardBg} shadow border ${cardBorder}`}>
                  <div className="flex flex-col space-y-1 text-sm">
                    <div className={`flex items-center gap-2 ${secondaryText}`}>{user.email}</div>
                    <div className={`flex items-center gap-2 ${tertiaryText} text-xs`}>{user.address}</div>
                    <div className={`flex items-center gap-2 ${tertiaryText}`}>{user.mobilePhone}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showNewEntryForm ? (
            <div className="mt-4 space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className={inputClass}
              />
              <input
                type="tel"
                value={mobilePhone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone"
                className={inputClass}
              />
              <input
                type="text"
                value={ethAddress}
                onChange={e => setEthAddress(e.target.value)}
                placeholder="Ethereum Address (0x...)"
                className={inputClass}
              />
              <div className="flex gap-2">
                <button onClick={addUser} className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}>
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={() => setShowNewEntryForm(false)}
                  className={`${buttonClass} bg-gray-500 text-white hover:bg-gray-600`}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewEntryForm(true)}
              className={`${buttonClass} mt-4 bg-green-600 text-white hover:bg-green-700`}>
              <Plus size={16} /> Add New Entry
            </button>
          )}
        </>
      </div>
    </div>
  );
};

export default Popup;
