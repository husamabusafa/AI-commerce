import { useState } from 'react';
import { UserPlus, Shield, User, Mail, Calendar } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../graphql/queries';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Badge from '../shared/Badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  avatar: string;
  joinedAt: string;
}

export default function Users() {
  const { data: usersData } = useQuery(GET_USERS);
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const users: User[] = usersData?.users || [];

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const userStats = {
    total: users.length,
    admins: users.filter((u: User) => u.role === 'admin').length,
    clients: users.filter((u: User) => u.role === 'client').length,
    recentJoins: users.filter((u: User) => {
      const joinDate = new Date(u.joinedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return joinDate >= thirtyDaysAgo;
    }).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100">{t('users.title')}</h1>
          <p className="text-slate-600 dark:text-gray-400">{t('users.subtitle')}</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {t('users.inviteUser')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-gray-100">{userStats.total}</div>
          <div className="text-sm text-slate-600 dark:text-gray-400">{t('users.totalUsers')}</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.admins}</div>
          <div className="text-sm text-slate-600 dark:text-gray-400">{t('users.admins')}</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.clients}</div>
          <div className="text-sm text-slate-600 dark:text-gray-400">{t('users.clients')}</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.recentJoins}</div>
          <div className="text-sm text-slate-600 dark:text-gray-400">{t('users.newUsers')}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder={t('users.searchPlaceholder')}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 text-sm border border-slate-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">{t('users.allRoles')}</option>
            <option value="admin">{t('users.admins')}</option>
            <option value="client">{t('users.clients')}</option>
          </select>
        </div>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card className="text-center py-12">
          <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-gray-100 mb-2">{t('users.noUsersTitle')}</h3>
          <p className="text-slate-600 dark:text-gray-400 mb-4">{t('users.noUsersDesc')}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user: User) => (
            <Card key={user.id} hover>
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-slate-900 dark:text-gray-100 truncate">{user.name}</h3>
                    <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                      {user.role === 'admin' ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          {t('users.admin')}
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1" />
                          {t('users.client')}
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-gray-400 mt-1">
                    <Mail className="h-3 w-3 mr-1" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-gray-400 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {t('users.joined')} {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {t('users.viewProfile')}
                  </Button>
                  <Button variant="ghost" size="sm">
                    •••
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}