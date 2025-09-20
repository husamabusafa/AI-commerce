import React, { useState } from 'react';
import { Search, UserPlus, Shield, User, Mail, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Badge from '../shared/Badge';

export default function Users() {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = state.users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const userStats = {
    total: state.users.length,
    admins: state.users.filter(u => u.role === 'admin').length,
    clients: state.users.filter(u => u.role === 'client').length,
    recentJoins: state.users.filter(u => {
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
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600">Manage user accounts and permissions</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-slate-900">{userStats.total}</div>
          <div className="text-sm text-slate-600">Total Users</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-blue-600">{userStats.admins}</div>
          <div className="text-sm text-slate-600">Admins</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-green-600">{userStats.clients}</div>
          <div className="text-sm text-slate-600">Clients</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-purple-600">{userStats.recentJoins}</div>
          <div className="text-sm text-slate-600">New (30d)</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="client">Clients</option>
          </select>
        </div>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card className="text-center py-12">
          <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
          <p className="text-slate-600 mb-4">No users match your search criteria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} hover>
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-slate-900 truncate">{user.name}</h3>
                    <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                      {user.role === 'admin' ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1" />
                          Client
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 mt-1">
                    <Mail className="h-3 w-3 mr-1" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Joined {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
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